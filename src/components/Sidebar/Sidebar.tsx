import { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import './Sidebar.css'
import { Context } from '../../context/Context'

const Sidebar = () => {
   const {prevPrompts,onSent,newChat}=useContext(Context)
    const [extended, setExtended] = useState<boolean>(true)

    const loadPrompt = async (prompt: string) => {
        if (onSent) {
           await onSent(prompt)
       }
    }

    return (
        <div className="sidebar">
            <div className="top">
                <img className="menu" src={assets.menu_icon} alt="menu" onClick={()=>setExtended(prev=>!prev)} />
                <div className="new-chat" onClick={() => newChat && newChat()}>
                    <img src={assets.plus_icon} alt="Add" />
                    {extended && <p>New Chat</p>}
                </div>
                {extended && prevPrompts && prevPrompts?.length>0 && <div className="recent">
                    <p className="recent-title">Recent</p>
                    {
                        prevPrompts?.map((item, index) => <div className="recent-entry" key={index} onClick={()=>loadPrompt(item)}>
                            <img src={assets.message_icon} alt="" />
                             <p>{item.substring(0, 15)}{ item?.length>15?"...":''}</p>
                        </div>)
                    }
                    
                </div>}
            </div>
            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="" />
                    {extended && <p>Help</p>}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="" />
                    {extended && <p>Activity</p>}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt="" />
                    {extended && <p>Settings</p>}
                </div>
            </div>
        </div>
    )
}

export default Sidebar