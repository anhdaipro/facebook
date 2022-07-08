import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
    FACEBOOK_AUTH_SUCCESS,
    FACEBOOK_AUTH_FAIL,
    LOGOUT,
    UPDATE_PROFILE_FAIL,
    UPDATE_PROFILE_SUCCESS,
    GET_THREAD_FAIL,
    GET_THREAD_SUCCESS,
    CREATE_THREAD_SUCCESS,
    CREATE_THREAD_FAIL,
    UPDATE_NOTIFI_SUCCESS,
    COMMENT_NOTIFY,
    SHOW_REPORT,
    SHOW_ACTIONPORT,
    SHOW_CHAT,
    ACTION_CHAT,
    SHOW_TURNOFF,
    UPLOADPOST

} from '../actions/types';
import { dataURLtoFile } from '../constants';

let initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null,
    count_notify_unseen:0,
    report:null,
    postaction:null,
    datachat:null,
    showchat:false,
    dataturnoff:null,
    messages:[],
    thread:null,
    members:[],
    datapost:null
};

const rootReducer=(state = initialState, action)=>{
    const { type, payload } = action;
    switch(type) {
        case UPDATE_NOTIFI_SUCCESS:
            return{
                ...state,
                notify:payload,
            }
        case SHOW_REPORT:
            return{
                ...state,
                report:payload
            }
        case UPLOADPOST:
            return{
                ...state,
                datapost:payload
            }
        case SHOW_TURNOFF:
            return{
                ...state,
                dataturnoff:payload
            }
        case ACTION_CHAT:
            return{
                ...state,
                datachat:payload
            }
        case SHOW_ACTIONPORT:
            return{
            ...state,
            postaction:payload
        }
        case SHOW_CHAT:
            return{
            ...state,
            showchat:true,
            messages:payload.messages,
            members:payload.members,
            thread:payload.thread
        }
        case UPDATE_PROFILE_SUCCESS:
            return{
                ...state,
                user:payload
            }
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user:payload,
                count_notify_unseen:payload.count_notify_unseen
            }
        case LOGIN_SUCCESS:
        case GOOGLE_AUTH_SUCCESS:
        case FACEBOOK_AUTH_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh
            }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            }
       
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                user:null
            }
        case SIGNUP_FAIL:
            return {
                ...state,
                isAuthenticated:null
            }
        case GOOGLE_AUTH_FAIL:
        case FACEBOOK_AUTH_FAIL:
        case LOGIN_FAIL:
        
        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            }
        case PASSWORD_RESET_SUCCESS:
        case PASSWORD_RESET_FAIL:
        case PASSWORD_RESET_CONFIRM_SUCCESS:
        case PASSWORD_RESET_CONFIRM_FAIL:
            return {
                ...state
            }
        default:
            return state
    }
};
export default rootReducer
