import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import ScrollToTop from "react-scroll-to-top";
import Looper from './Looper';
import './Supremecommander.css'

export default function Manager() {
    const [selectname, setSelectname] = useState('')
    const[is,setIs]=useState(true);
    // const navigate = useNavigate();
    const { id } = useParams()
    const { department } = useParams()
    const [toggles, setToggles] = useState(false);
    const [user, setUser] = useState("")
    const [users, setUsers] = useState([])
    const [progress, setProgres] = useState([])
    const tableRef = useRef(null);
    const today = new Date()
    var monthcurrent = today.getFullYear() + '-' + (today.getMonth() + 1)
    const [month, setMonth] = useState(monthcurrent);
    const[showmore,setShowmore]=useState(true)

    useEffect(() => {
        axios.get(`http://172.16.0.197:3001/singleuserusingid/${id}`).then(res => setUser(res.data.user))
    }, [id])

    useEffect(() => {
        axios.get(`http://172.16.0.197:3001/getdepartmentreport/${id}/${department}`).then(res => setProgres(res.data.user))
    }, [id,department])

    useEffect(() => {
        axios.get(`http://172.16.0.197:3001/getdepartmentuser/${id}/${department}`).then(res => setUsers(res.data.user))
    }, [id,department])

    function changes(e) {
        setSelectname(e.target.value)
        setIs(false)
    }
    return (
        <>

            <header id="header" className="fixed-top header-scrolled">
                <div className="container d-flex align-items-center">
                    <h1 className="logo me-auto"><a>RuruTask</a></h1>
                    <nav id="navbar" className={toggles ? "navbar navbar-mobile" : "navbar"} >
                        <ul>
                            <li style={{ color: "white" }}>Hey {user.name}..!</li>
                            <div class="dropdown">
                                <button class="btn btn-secondary " type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: "transparent", border: "none", margin: "4px" }}>
                                    View Team
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li>{user.testing === "" ? <></> : <a className="nav-link scrollto" href={`/views/${user.testing}`}>{user.testing}</a>}</li>
                                    <li>{user.development === "" ? <></> : <a className="nav-link scrollto" href={`/views/${user.development}`}>{user.development}</a>}</li>
                                    <li>{user.designing === "" ? <></> : <a className="nav-link scrollto" href={`/views/${user.designing}`}>{user.designing}</a>}</li>
                                </ul>
                            </div>
                            <li><a className="getstarted scrollto" href="/">Logout</a></li>
                        </ul>
                        <i className="bi bi-list mobile-nav-toggle" onClick={(e) => { setToggles(!toggles) }} />
                    </nav>
                </div>
            </header>
            <br />
            <main id="main">
                <section id="Report" className="contact">
                    <div className="container" data-aos="fade-up">
                        <div className="row">
                            <div className="col-12" >
                                <div className=" rounded h-100 p-4" style={{
                  backgroundImage: "linear-gradient(to top right, #293c5d 60%, #37517e 70%)", borderRight: "3px solid #47b2e4",
                  borderTop: "3px solid #47b2e4", borderBottom: "3px solid #47b2e4"
                }}>
                                    <div className="section-title">
                                        <h5 className="text-center text-light">{user.department} Team</h5>
                                    </div>
                                    <div className='row skills' id="skills">
                                        <div className="col-md-3  content">

                                            <input type="month" value={month} name="name" className="form-control" id="name" onChange={(e) => setMonth(e.target.value)} required />
                                        </div>
                                        <div className="form-group col-md-3">


                                            <select className="form-control" name="name" id="name" value={selectname} onChange={changes} required style={{fontWeight:"600"}}>
                                                <option>Choose Employee</option>
                                                {users.filter((admin) => admin.type !== "manager" && admin.type !== "admin").map((datas, index) => <>
                                                    <option key={index}>{datas.name}</option>
                                                </>
                                                )}
                                            </select>

                                        </div>
                                        <div className="col-md-3 pt-lg-0  content">
                                            <DownloadTableExcel
                                                filename={selectname + " " + month}
                                                sheet={selectname}
                                                currentTableRef={tableRef.current}
                                            >
                                                <button className="btn btn-success">
                                                    Download Excel </button>
                                            </DownloadTableExcel>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="row row-cards row-deck lol">
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="table-responsive">
                                                    <table ref={tableRef} className="table table-bordered table-hover table-outline table-vcenter  card-table">
                                                        <thead>
                                                            <tr style={{position:"sticky",top:"0"}}>
                                                                <th className="text-center">Date</th>
                                                                <th className="text-center">Work</th>
                                                                <th className="text-center">Task</th>
                                                                <th className="text-center">Progress</th>
                                                                <th className="text-center">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {is?<Looper/>:users.map((userdatas, index) => <>

                                                                {progress.filter((getuser) =>
                                                                    new Date(getuser.date).getMonth() + 1 === new Date(month).getMonth() + 1
                                                                    && new Date(getuser.date).getFullYear() === new Date(month).getFullYear()
                                                                    && selectname === userdatas.name

                                                                    && getuser.empid === userdatas.empid).sort((a, b) => new Date(a.date).getDate() > new Date(b.date).getDate() ? 1:-1).map((prog, index) =>

                                                                        <>

                                                                            {prog.task.map((pro, index) =>

                                                                                <tr key={index}>
                                                                                    <td className='text-center text-nowrap' >{index === 0 ? <>{prog.date}</> : <></>}</td>
                                                                                    <td className="text-nowrap">{pro.work}</td>
                                                                                    <td>{pro.tasks}</td>
                                                                                    {/* <td>{pro.tasks.length > 80? <span>{pro.tasks.slice(0,80)}{showmore === pro.tasks.slice(80) ? showmore :<span onClick={()=>setShowmore(pro.tasks.slice(80))}  style={{color:"blue",cursor:"pointer",fontSize:"13px"}}>...readmore</span>}</span> : <span>{pro.tasks}</span> }</td> */}
                                                                                    <td className='text-center text-nowrap'>{pro.today_progress}%</td>
                                                                                    <td  className="text-nowrap" style={{ color: pro.today_progress === "100" ? "green" : "red", display: 'flex', justifyContent: "center", textAlign: "center" }} key={index}> {pro.today_progress === "100" ? <span>Completed</span> : <span>In Progress</span>}</td>

                                                                                </tr>)}</>)}</>)}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <ScrollToTop smooth style={{ filter: "drop-shadow(2px 2px 1px  #47b2e4)" }} />
        </>
    )
}
