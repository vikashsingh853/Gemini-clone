type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export class JsonToTsClass {
  private readonly className: string;

  constructor(className: string) {
    this.className = className;
  }

  /**
   * Converts JSON into TypeScript class definitions
   * @param json The JSON object to convert
   * @returns A string containing the generated TypeScript class definitions
   */
  public convert(json: JsonValue): string {
    if (typeof json !== "object" || json === null) {
      throw new Error("Invalid JSON: Must be an object or array");
    }

    const classes: string[] = [];
    this.processObject(json as Record<string, JsonValue>, this.className, classes);
    return classes.join("\n\n");
  }

  /**
   * Processes an object to generate a class definition
   * @param obj The object to process
   * @param className The name of the class to generate
   * @param classes Array to store the generated class definitions
   */
  private processObject(obj: Record<string, JsonValue>, className: string, classes: string[]): void {
    const classDefinition: string[] = [`export class ${className} {`];
    const constructorLines: string[] = [`  constructor(data: any = {}) {`];

    for (const key in obj) {
      const value = obj[key];
      const type = this.determineType(key, value, className, classes);
      classDefinition.push(`  ${key}: ${type};`);

      const defaultValue = this.getDefaultValue(value, key, type);
      constructorLines.push(`    this.${key} = ${defaultValue};`);
    }

    constructorLines.push("  }");
    classDefinition.push("");
    classDefinition.push(...constructorLines);
    classDefinition.push("}");
    classes.push(classDefinition.join("\n"));
  }

  /**
   * Determines the TypeScript type of a given value
   * @param key The key of the value
   * @param value The value to determine the type for
   * @param parentClass The parent class name
   * @param classes Array to store additional class definitions if needed
   * @returns The TypeScript type as a string
   */
  private determineType(
    key: string,
    value: JsonValue,
    parentClass: string,
    classes: string[]
  ): string {
    if (value === null) return "any";
    if (Array.isArray(value)) {
      if (value.length > 0) {
        const arrayType = this.determineType(key, value[0], parentClass, classes);
        return `${arrayType}[]`;
      }
      return "any[]";
    }
    if (typeof value === "object") {
      const childClassName = this.capitalize(key);
      this.processObject(value as Record<string, JsonValue>, childClassName, classes);
      return childClassName;
    }
    return typeof value;
  }

  /**
   * Generates the default value for a given type
   * @param value The value to determine the default for
   * @param key The key of the value
   * @param type The determined TypeScript type
   * @returns The default value as a string
   */
  private getDefaultValue(value: JsonValue, key: string, type: string): string {
    if (type.endsWith("[]")) {
      return `data?.${key} ?? []`;
    }
    if (type === "string") {
      return `data?.${key} ?? ''`;
    }
    if (type === "number") {
      return `data?.${key} ?? 0`;
    }
    if (type === "boolean") {
      return `data?.${key} ?? false`;
    }
    return `new ${type}(data?.${key} ?? {})`;
  }

  /**
   * Capitalizes the first letter of a string
   * @param str The string to capitalize
   * @returns The capitalized string
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
