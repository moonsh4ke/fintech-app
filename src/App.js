import React, {useState, useEffect} from 'react'
import './App.css';
import {Button, Form, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [horizont, setHorizont] = useState(0);
    const [investment, setInvestment] = useState(0);
    const [show, setShow] = useState(false);
    const [endDate, setEndDate] = useState("fecha1");
    const [startDate, setStartDate] = useState("fecha2");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=qqq&outputsize=compact&apikey=YVKR63PHC3R9SV48'
    const [days, setDays] = useState();

    const dateObjToStringFormat = (dateObj) => {
        let dd = String(dateObj.getDate()).padStart(2, '0');
        let mm = String(dateObj.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = dateObj.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
    }

    const getValidDate = (dateObj) => {
        let dateString;
        while (true)
        {
            dateString = dateObjToStringFormat(dateObj);
            if((dateString in days))
                return dateString;
            dateObj.setDate(dateObj.getDate() - 1);
        }
    }

    const fetchApi = async () => {
        const response = await fetch(url)
        const responseJSON = await response.json();
        setDays(responseJSON["Time Series (Daily)"]);
    }

    useEffect(() => {
        fetchApi();
    }, [])

    // let today = dateObjToStringFormat(new Date());
    // let end_date = getValidDate(today);
    //let end_date = getValidDate((new Date("2022","04","02")));

    let calcEvent = () => {
        console.log("This calc event is properly handled");
        setEndDate(getValidDate(new Date()), () => console.log(endDate));
        //let parts = endDate.split('-');
        //let test = new Date(parts[0] - horizont, parts[1] - 1, parts[2])
        //setStartDate(getValidDate(test));
        handleShow();
    }

  return (
    <div className="App">
      <Form>
        <Form.Group>
            <Form.Label> Monto: </Form.Label>
            <Form.Control
                type="text"
                onChange={(e) => setInvestment(e.target.value) }
                placeholder="inversion" />
            <Form.Label>Horizonte temporal: </Form.Label>
            <Form.Control 
                type="text" 
                onChange={(e) => setHorizont(e.target.value) }
                placeholder="tiempo" />
            <Button onClick={calcEvent}>Calcular</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!. start is end is </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleClose}>
                    Save Changes
                  </Button>
                </Modal.Footer>
            </Modal>
        </Form.Group>
      </Form>
    </div>
  );
}

// <div className='test-div2'>{endDate}</div>
// <div className='test-div1'>{JSON.stringify(days[today])}</div>

export default App;
