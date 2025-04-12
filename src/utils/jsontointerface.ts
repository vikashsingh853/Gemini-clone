type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };


interface TypeDefinition {
    type: string;
    isArray: boolean;
    defaultValue: string;
}

export class JsonToTsClass {
    private readonly className: string;
    private readonly seenTypes: Set<string>;

    constructor(className: string) {
        this.className = this.sanitizeClassName(className || 'DefaultClass');
        this.seenTypes = new Set<string>();
    }

    private sanitizeClassName(name: string): string {
        return name.replace(/[^a-zA-Z0-9_]/g, '') || 'DefaultClass';
    }

    public convert(json: JsonValue): string {
        if (!this.isValidJsonInput(json)) {
            // If invalid input, create a class with no properties
            const emptyObj: Record<string, JsonValue> = {};
            const classes: string[] = [];
            this.processObject(emptyObj, this.className, classes);
            return classes.join("\n\n");
        }

        const classes: string[] = [];
        this.processObject(json as Record<string, JsonValue>, this.className, classes);
        return classes.join("\n\n");
    }

    private isValidJsonInput(json: JsonValue): json is Record<string, JsonValue> {
        return typeof json === "object" && json !== null && !Array.isArray(json);
    }

    private processObject(obj: Record<string, JsonValue>, className: string, classes: string[]): void {
        if (this.seenTypes.has(className)) {
            return;
        }
        this.seenTypes.add(className);

        const properties: string[] = [];
        const constructorLines: string[] = [];
        const interfaceProperties: string[] = [];
        const validationMethods: string[] = [];

        // Generate interface for the data parameter
        const interfaceName = `I${className}Data`;
        interfaceProperties.push(`export interface ${interfaceName} {`);

        // Process properties
        for (const [key, value] of Object.entries(obj)) {
            const typeInfo = this.determineType(key, value, className, classes);

            // Private field declaration
            properties.push(`  private _${key}: ${typeInfo.type}${typeInfo.isArray ? '[]' : ''};`);

            // Getter with null/undefined check
            properties.push(`  get ${key}(): ${typeInfo.type}${typeInfo.isArray ? '[]' : ''} {`);
            properties.push(`    return this._${key} ?? ${typeInfo.defaultValue};`);
            properties.push(`  }`);

            // Setter with type validation
            properties.push(`  set ${key}(value: ${typeInfo.type}${typeInfo.isArray ? '[]' : ''} | null | undefined) {`);
            if (typeInfo.isArray) {
                properties.push(`    this._${key} = this.validateArray(value, '${typeInfo.type}');`);
            } else {
                properties.push(`    this._${key} = this.validateValue(value, '${typeInfo.type}') ?? ${typeInfo.defaultValue};`);
            }
            properties.push(`  }`);
            properties.push(``);

            // Add to interface as optional property
            interfaceProperties.push(`  ${key}?: ${typeInfo.type}${typeInfo.isArray ? '[]' : ''} | null;`);

            // Constructor initialization
            constructorLines.push(`    this._${key} = this.initializeProperty<${typeInfo.type}${typeInfo.isArray ? '[]' : ''}>(data, '${key}', ${typeInfo.defaultValue});`);
        }

        interfaceProperties.push(`}`);

        // Add validation methods
        validationMethods.push(`
  private validateArray<T>(value: T[] | null | undefined, type: string): T[] {
    if (value === null || value === undefined) return [];
    if (!Array.isArray(value)) return [];
    return value.filter(item => this.validateValue(item, type) !== null);
  }

  private validateValue<T>(value: T | null | undefined, type: string): T | null {
    if (value === null || value === undefined) return null;
    
    switch (type) {
      case 'string':
        return typeof value === 'string' ? value as T : null;
      case 'number':
        return typeof value === 'number' && !isNaN(value) ? value as T : null;
      case 'boolean':
        return typeof value === 'boolean' ? value as T : null;
      default:
        return typeof value === 'object' ? value : null;
    }
  }

  private initializeProperty<T>(data: unknown, key: string, defaultValue: T): T {
    if (!this.isValidProperty<T>(data, key)) {
      return defaultValue;
    }
    const value = data[key];
    return this.validateValue(value, typeof defaultValue) ?? defaultValue;
  }

  private isValidProperty<T>(data: unknown, key: string): data is { [K in string]: T } {
    return data !== null && typeof data === 'object' && key in data;
  }

  public toJSON(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key of Object.getOwnPropertyNames(this)) {
      if (key.startsWith('_')) {
        const publicKey = key.slice(1);
        result[publicKey] = this[publicKey];
      }
    }
    return result;
  }
`);

        // Generate class
        const classDefinition: string[] = [
            ...interfaceProperties,
            ``,
            `export class ${className} {`,
            ...properties,
            `  constructor(data: ${interfaceName} | null | undefined = {}) {`,
            `    const sanitizedData = data ?? {};`,
            ...constructorLines,
            `  }`,
            ...validationMethods,
            `}`,
        ];

        classes.push(classDefinition.join('\n'));
    }

    private determineType(
        key: string,
        value: JsonValue,
        parentClass: string,
        classes: string[]
    ): TypeDefinition {
        if (value === null) {
            return { type: 'any', isArray: false, defaultValue: 'null' };
        }

        if (Array.isArray(value)) {
            if (value.length > 0) {
                const elementType = this.determineType(key, value[0], parentClass, classes);
                return {
                    type: elementType.type,
                    isArray: true,
                    defaultValue: '[]'
                };
            }
            return { type: 'any', isArray: true, defaultValue: '[]' };
        }

        if (typeof value === "object") {
            const childClassName = this.capitalize(this.sanitizeClassName(key));
            this.processObject(value as Record<string, JsonValue>, childClassName, classes);
            return {
                type: childClassName,
                isArray: false,
                defaultValue: `new ${childClassName}()`
            };
        }

        const primitiveDefaults: Record<string, string> = {
            'string': "''",
            'number': '0',
            'boolean': 'false'
        };

        return {
            type: typeof value,
            isArray: false,
            defaultValue: primitiveDefaults[typeof value] || '{}'
        };
    }

    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}


