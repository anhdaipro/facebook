import Navbar from "../Navbar"
import Leftcontent from "./Leftcontent"
import Rightcontent from "./Rightcontent"

const Homegroup=()=>{
    return (
        <>
            <Navbar/>
            <div className="container">
                <Leftcontent/>
                <Rightcontent/>
            </div>
        </>
    )
}
export default Homegroup