import { useContext, useRef } from 'react'
import { assets } from '../../assets/assets'
import './Main.css'
import { Context } from '../../context/Context'

const Main = () => {
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context)

//    const goToBottom=() => {
//         if (chatContainerRef.current) {
//             chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//     }

    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon}  alt="" />
            </div>
            <div className="main-container">
                {
                    !showResult ? <>
                        <div className="greet">
                            <p><span>Hello, Vikash</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div className="card">
                                <p>Suggest beautiful places</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Briefly summarize the concept: urban planning</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Suggest beautiful locations3</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Suggest beautiful locations4</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </> :
                        <div className='result' ref={chatContainerRef}>
                            <div className="result-title">
                                <img src={assets.user_icon} alt="" />
                                <p>{recentPrompt}</p>
                            </div>
                            <div className="result-data">
                                <img src={assets.gemini_icon} alt="" />
                                {loading ? <>
                                    <div className='loader'>
                                        <hr />
                                        <hr />
                                        <hr />
                                   </div>
                                </> : <>  {resultData && <div  dangerouslySetInnerHTML={{ __html: resultData }} />}</>}
                              
                            </div>
                        </div>
                }


                <div className="main-bottom">
                    <div className="search-box">
                        <input onChange={(e) => {
                            if (setInput) {
                                setInput(e.target.value)
                            }
                        }} value={input} type="text" placeholder='Enter a prompt here' />
                        <div>
                            {/* <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" /> */}
                            {input && <img src={assets.send_icon} alt="" onClick={() => onSent && onSent()} />}
                        </div>

                    </div>
                    <p className="bottom-info">
                        Gemini may display incorrect info , including about people, so double check its responces. Your privacy and Gemini Apps.
                    </p>
                    <p className="bottom-copy">© Google and VKS</p>

                </div>

            </div>
        </div>
    )
}

export default Main