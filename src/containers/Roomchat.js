const RoomchatCreate=(props)=>{
    const {listfriend}=props
    return(
        <div className="post room-chat create">
            <div className="room-chat">
                <div className="add-room-chat">
                    <div class="oi9244e8 pq6dq46d">
                        <i data-visualcompletion="css-img" class="hu5pjgll" style={{backgroundImage: `url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/ym/r/5zaboDASSye.png&quot;)`, backgroundPosition: '0px -219px', backgroundSize: 'auto', width: '24px', height: '24px', backgroundRepeat: 'no-repeat', display: 'inline-block'}}></i>
                    </div>
                    {listfriend.map(item=>
                    <div className="avatar-friend">
                        <img src={item.avatar}/>
                    </div>
                    )}
                    
                </div>
            </div>
            <div className="show-more-friends">
                <div className="icon-next">
                    <svg fill="currentColor" viewBox="0 0 20 20" width="1em" height="1em" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4 py1f6qlh rgmg9uty b73ngqbp"><path d="M7.8 4.53 13.273 10 7.8 15.47a.75.75 0 0 0 1.061 1.06l6-6a.751.751 0 0 0 0-1.06l-6-6A.75.75 0 0 0 7.8 4.53z"></path></svg>
                </div>
            </div>
        </div>
    )
    
}
export default RoomchatCreate