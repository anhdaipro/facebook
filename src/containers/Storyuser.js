import React,{useState,useEffect, useRef,useCallback} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Navbar from "./Navbar"
import Sibamenu from './Sibamenu';
import { listfriendURL, originurl,liststoriesURL,storiesuserURL, liststoryfriendURL } from '../urls';

import { Link, Navigate, useNavigate,useParams } from 'react-router-dom';
import { headers } from '../actions/auth';
import Story from './Story';
const Storyuser=()=>{
    const [liststories,setListstories]=useState([])
    const [loading,setLoading]=useState(false)
      
    return(
        <Story
            storyfriend={liststories}
            loadingdata={loading}
        />
    )
}
export default Storyuser