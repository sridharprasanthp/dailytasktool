import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Admin from './Admin';
import './Task.css';
import employee from './employee.jpg';

export default function Task() {
  const [scroll, setScroll] = useState(false);
  const [toggles, setToggles] = useState(false);
  const [user, setUser] = useState('');
  const [dates, setDates] = useState(new Date().toISOString().substring(0, 10))
  const { id } = useParams();
    const navigate = useNavigate();
  const viewpage = `/view/${user.empid}`;
  const progresspage = `/progress/${user.empid}`;
  let notYesterday = new Date().setDate(new Date().getDate() - 2);

  const [task, setTask] = useState(
    [{tasks:'',
  work:'',
today_progress:0}]
  )
  function addTask() {
    const added = {
      id: Math.floor(Math.random() * 1000),
      tasks: '',
      work:'',
      today_progress: 0
    }
    return setTask((prev) => [...prev, added])
  }
  function deleteTask(id) {
    return setTask((prev) => {
      return prev.filter((pre) => pre.id !== id)
    })
  }

  const handleTask = (index, event) => {
    const values = [...task];
    values[index][event.target.name] = event.target.value;
    setTask(values);
  }
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 50);
    });
  }, []);
  function handleSubmit(e) {
    e.preventDefault();
    if (task[0].tasks === "") {
      alert("Input Data")
    }
    else {
      const tasks = JSON.stringify(task);

      const taskdatas = {
        empid: user.empid,
        date: new Date(dates).toLocaleDateString('en-US'),
        department : user.department,
        task: tasks
      }
      axios.post('http://172.16.0.142:3001/task', taskdatas).then(res => res.data.message === 'Successfull'? navigate(`/view/${res.data.report.empid}`):alert(res.data.message))
    }
  }

  useEffect(() => {
    axios.get(`http://172.16.0.142:3001/singleuserusingid/${id}`).then(res => setUser(res.data))
  }, [])

  if (user.length === 0) {
    return <h1>Error Page</h1>
}
else if (user.type === "admin") {
    return (
        <>
            <Admin></Admin>
        </>)
}

else if (user.empid !== "admin") {

  return (
    <div>
      <header id="header" className={scroll?"fixed-top header-scrolled":"fixed-top"}>
        <div className="container d-flex align-items-center">
          <h1 className="logo me-auto"><a>RuruTask</a></h1>
          <nav id="navbar" className={toggles ? "navbar navbar-mobile" : "navbar"} >
            <ul>
              {/* <li><a className="nav-link scrollto" href="#Report">Go to Top</a></li> */}
              <li><a className="nav-link scrollto" href={viewpage}>View and Edit</a></li>
              <li><a className="nav-link" href={progresspage}>View Progress</a></li>
              <li><a className="getstarted" href="/">Logout</a></li>
            </ul>
            <i className="bi bi-list mobile-nav-toggle" onClick={(e) => { setToggles(!toggles) }} />
          </nav>
        </div>
      </header>

      <main id="main">
<section id="hero" className="team section-bg my-5">
  <div className="container" data-aos="fade-up">
    {/* <div className="section-title">
      <h2 style={{color:'white',fontSize:'27px'}}>REPORT</h2>
    </div> */}
    <div className="col-md-7 mx-auto">
        <div className="member d-flex align-items-start" data-aos="zoom-in" data-aos-delay={100}>
          <div className="pic"><img src={employee} className="img-fluid" alt /></div>
          <div className="member-info">
            <div className='row'>
            <div className="form-group col-md-7 my-4">
            <h4 style={{textTransform:'uppercase'}}>{user.name}</h4>
            <span>{user.department} Team</span>
            </div>
            <div className="form-group col-md-5 my-4">
                {/* <label htmlFor="name">Date</label> */}
                <input type="date" name="name" className="form-control" value={dates} onChange={(e) => { setDates(e.target.value) }} id="name" required />
                </div>
            </div>

            <form role="form" className="php-email-form">

                  
          {task.map((exp, index) => <>
                  <div className='row'>
                    <div className="form-group col-md-7 my-2">
                {/* <label htmlFor="name">Work</label> */}
                <input class="form-control" value={exp.work} name="work" onChange={e => handleTask(index, e)} placeholder={`Work ${index+1}`} required></input>
                </div>
                <div className="form-group col-md-3 my-2 ">
                      <button type="button" id="deletetask" onClick={() => deleteTask(exp.id)} >Delete</button>
                    </div>
                    <div className="form-group col-md-2 my-2">
                <button type="button" id="addtask" onClick={addTask} > +</button>
              </div>
                    </div>
                    <div class="form-group my-2">
                      <label for="name">Task {index + 1}</label>
                      <textarea class="form-control" value={exp.tasks} name="tasks" rows="1" placeholder={`Task ${index+1}`} onChange={e => handleTask(index, e)} required></textarea>
                    </div>
                    <div className='row'>
                    <div class="form-group col-md-6 my-2">
                    <input type="range" name="today_progress"  className = "form-control" style={{border:"none"}} value={exp.today_progress} onChange={e => handleTask(index, e)} required />
                    </div>
                    <div class="form-group col-md-6 my-2">
                    <label for="name">{exp.today_progress}% Progress </label>
                    </div>

                    </div>
              </>)}
                    <br></br>
                  {task.length === 0 ? <></>:<div className="text-center"><button type="submit"  id="deletetask"  onClick={handleSubmit} disabled={new Date(dates)>new Date() || new Date(dates)<new Date(notYesterday)}>Submit</button></div>}
</form>
          </div>
          
        </div>
        
      </div>
  </div>
</section>
      </main>

    </div>
  )
}}
