import { originurl} from "../urls"


function Entry(props){
    const {
      mention,
      theme,
      searchValue, 
      isFocused,
      ...parentProps
    } = props;
  
    return (
      <div {...parentProps} >
          <div key={mention.id} data-e2e="comment-at-list" className="tiktok-d4c6zy-DivItemBackground ewopnkv6">
              <div className="tiktok-1rn2hi8-DivItemContainer ewopnkv5">
                  <span shape="circle" className="tiktok-tuohvl-SpanAvatarContainer e1e9er4e0" style={{flex: '0 0 40px', width: '40px', height: '40px'}}>
                      <img loading="lazy" src={mention.avatar} className="tiktok-1zpj2q-ImgAvatar e1e9er4e1"/>
                  </span>
                  <div className="tiktok-4f7266-DivInfoContainer ewopnkv7">
                      <p className="tiktok-15s5y80-PMentionInfoLine ewopnkv8">
                          <span data-e2e="comment-at-nickname" className="tiktok-evv4sm-SpanInfoNickname ewopnkv9">{mention.name}</span>
                              <span className="tiktok-14bueqa-SpanInfoVerify ewopnkv12">
                              <svg className="tiktok-shsbhf-StyledVerifyBadge e1aglo370" width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#20D5EC"></circle><path fillRule="evenodd" clipRule="evenodd" d="M37.1213 15.8787C38.2929 17.0503 38.2929 18.9497 37.1213 20.1213L23.6213 33.6213C22.4497 34.7929 20.5503 34.7929 19.3787 33.6213L10.8787 25.1213C9.70711 23.9497 9.70711 22.0503 10.8787 20.8787C12.0503 19.7071 13.9497 19.7071 15.1213 20.8787L21.5 27.2574L32.8787 15.8787C34.0503 14.7071 35.9497 14.7071 37.1213 15.8787Z" fill="white"></path></svg>
                          </span>
                      </p>
                      <p className="tiktok-15s5y80-PMentionInfoLine ewopnkv8">
                          <span data-e2e="comment-at-uniqueid" className="tiktok-ny41l3-SpanInfoUniqueId ewopnkv10">Bạn bè</span>
                      </p>
                  </div>
              </div>
          </div>
      </div>
    );
  }
  export default Entry