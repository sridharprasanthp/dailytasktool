import axios from 'axios';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import ScrollToTop from "react-scroll-to-top";
import Looper from './Looper';
import './Supremecommander.css'


export default function Admin() {
  const [selectname, setSelectname] = useState('')
  const [adminuser, setAdminuser] = useState({})
  const [user, setUser] = useState([{}]);
  const [toggles, setToggles] = useState(false);
  const [progres, setProgres] = useState([])
  const { department } = useParams();
  const { id } = useParams();
  const tableRef = useRef(null);
  const today = new Date()
  var monthcurrent = today.getFullYear() + '-' + (today.getMonth() + 1)
  const [month, setMonth] = useState(monthcurrent);
  // let i = 1;
  const [is, setIs] = useState(true);
  const[showmore,setShowmore]=useState(true)

  useEffect(() => {
    axios.get(`http://172.16.0.197:3001/singleuserusingid/${id}`).then((res) => { setAdminuser(res.data.user) })
  }, [id])

  useEffect(() => {
    axios.get(`http://172.16.0.197:3001/getdepartmentreport/${id}/${department}`).then(res => setProgres(res.data.user))
  }, [id, department])


  useEffect(() => {
    axios.get(`http://172.16.0.197:3001/getdepartmentuser/${id}/${department}`).then(res => setUser(res.data.user))
  }, [id, department])


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
              <li style={{ color: "white" }}>Hey {adminuser.name}..!</li>
              {/* <li><a className="nav-link scrollto" href="#Report">Go to Top</a></li> */}
              <li><a className="getstarted scrollto" href="/">Logout</a></li>
            </ul>
            <i className="bi bi-list mobile-nav-toggle" onClick={(e) => { setToggles(!toggles) }} />
          </nav>
        </div>
      </header>
      <br></br>
      <main id="main">
        <section id="Report" className="contact" >
          <div className="container" data-aos="fade-up">

            <div className="row" >
              <div className="col-12" >

                <div className=" rounded h-100 p-4" style={{
                  backgroundImage: "linear-gradient(to top right, #293c5d 60%, #37517e 70%)", borderRight: "3px solid #47b2e4",
                  borderTop: "3px solid #47b2e4", borderBottom: "3px solid #47b2e4"
                }}>

                  <div className="section-title">
                    <h5 className="text-center text-light" >{adminuser.department} TEAM</h5>
                  </div>
                  <div className='row skills' id="skills">
                    <div className="col-md-3 pt-4 pt-lg-0 content">

                      <input type="month" value={month} name="name" className="form-control" id="name" onChange={(e) => setMonth(e.target.value)} required />
                    </div>
                    <div className="form-group col-md-3">


                      <select className="form-control" name="name" id="name" value={selectname} onChange={changes} required style={{ fontWeight: "600" }}>
                        <option>Choose Employee</option>
                        {user.filter((admin) => admin.type !== "admin").map((datas, index) => <>
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
                          <table ref={tableRef} className="table overflow-scroll table-bordered table-hover table-outline table-vcenter  card-table" >
                            <thead >
                              <tr style={{position:"sticky",top:"0"}}>
                                <th className="text-center">Date</th>
                                <th className="text-center">Work</th>
                                <th className="text-center">Task</th>
                                <th className="text-center">Progress</th>
                                <th className="text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody>

                              {is ? <Looper /> : user.map((userdatas, index) => <>

                                {progres.filter((getuser) =>
                                  new Date(getuser.date).getMonth() + 1 === new Date(month).getMonth() + 1
                                  && new Date(getuser.date).getFullYear() === new Date(month).getFullYear()
                                  && selectname === userdatas.name
                                  && getuser.empid === userdatas.empid).sort((a, b) => new Date(a.date).getDate() > new Date(b.date).getDate() ? 1:-1).map((prog, index) =>

                                    <>




                                      {prog.task.map((pro, index) =>

                                        <tr key={index}>
                                          <td className='text-center text-nowrap' >{index === 0 ? <>{prog.date}</> : <></>}</td>
                                          <td className='text-nowrap'>{pro.work}</td>
                                          <td>{pro.tasks}</td>
                                          {/* <td>{pro.tasks.length > 80? <span>{pro.tasks.slice(0,80)}{showmore === pro.tasks.slice(80) ? showmore :<span onClick={()=>setShowmore(pro.tasks.slice(80))}  style={{color:"blue",cursor:"pointer",fontSize:"13px"}}>...readmore</span>}</span> : <span>{pro.tasks}</span> }</td> */}
                                          <td className='text-center text-nowrap'>{pro.today_progress}%</td>
                                          <td  className=' text-nowrap' style={{ color: pro.today_progress === "100" ? "green" : "red", display: 'flex', justifyContent: "center", textAlign: "center" }} key={index}> {pro.today_progress === "100" ? <span>Completed</span> : <span>In Progress</span>}</td>

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
