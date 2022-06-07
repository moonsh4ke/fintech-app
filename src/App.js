import React, {useState, useEffect} from 'react'
import './App.css';
import {Stack, Button, Form, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Etf from './components/Etf';

function App() {
    const today = new Date();
    const [horizont, setHorizont] = useState(1);
    const [investment, setInvestment] = useState(1000);
    const [show, setShow] = useState(false);
    const [endDate, setEndDate] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [daysQqq, setDaysQqq] = useState(null);
    const [daysSpy, setDaysSpy] = useState(null);
    const [daysMdy, setDaysMdy] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const qqq_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=qqq&outputsize=full&apikey=SWC6WJN4YJHTQH1A'
    const spy_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=spy&outputsize=full&apikey=SWC6WJN4YJHTQH1A'
    const mdy_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=mdy&outputsize=full&apikey=SWC6WJN4YJHTQH1A'


    // Convierte una objeto de tipo Date a su representacion yyyy-mm-dd
    const dateObjToStringFormat = (dateObj) => {
        let dd = String(dateObj.getDate()).padStart(2, '0');
        let mm = String(dateObj.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = dateObj.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
    }

    // Obtiene la fecha mas cercana en la query a dateObj (esto es porque no se actualizan los valores el fds)
    const getValidDate = (dateObj) => {
        let dateString;
        while (true) {
            dateString = dateObjToStringFormat(dateObj);
            console.log("im go to test " + dateString);
            if ((dateString in daysQqq))
                return dateString;
            dateObj.setDate(dateObj.getDate() - 1);
        }
    }

    const fetchApiQqq = async (url) => {
        const response = await fetch(url)
        const responseJSON = await response.json();
        setDaysQqq(responseJSON["Time Series (Daily)"]);
    }

    const fetchApiSpy = async (url) => {
        const response = await fetch(url)
        const responseJSON = await response.json();
        setDaysSpy(responseJSON["Time Series (Daily)"]);
    }

    const fetchApiMdy = async (url) => {
        const response = await fetch(url)
        const responseJSON = await response.json();
        setDaysMdy(responseJSON["Time Series (Daily)"]);
    }

    const profit = (start, end) => {
        return ((end / start) - 1) * 100;
    }

    // Se hace la querie para cada end point
    useEffect(() => {
        fetchApiQqq(qqq_url);
        fetchApiSpy(spy_url);
        fetchApiMdy(mdy_url);
    }, [])

    // Setear las fechas de inicio y fin en funcion de la query (al inicio)
    useEffect(() => {
        setStartEnd();
    }, [daysQqq])


    // Si cambia el horizonte temporal, entonces actualiza la fecha de inicio
    useEffect(() => {
        if (daysQqq && horizont < 20 && horizont > 0) {
            let parts = dateObjToStringFormat(today).split("-");
            let test = new Date(parts[0] - horizont, parts[1] - 1, parts[2])
            setStartDate(getValidDate(test))
        }
    }, [horizont])

    // Setea las fechas de inicio y fin
    let setStartEnd = () => {
        if (daysQqq) {
            let parts = dateObjToStringFormat(today).split("-");
            let test = new Date(parts[0] - horizont, parts[1] - 1, parts[2])
            setStartDate(getValidDate(test));
            setEndDate(getValidDate(today));
        }
    }

    return (
        <div className="App">
            <Stack gap={2} className="col-md-1 mx-auto mt-20">
                <Form>
                    <Form.Group>
                        <Form.Label> Monto: </Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            onChange={(e) => setInvestment(e.target.value)}
                            value={investment}
                            placeholder="Inversión" />
                        <Form.Label>Horizonte temporal: </Form.Label>
                        <Form.Control
                            placeholder="Horizonte"
                            type="number"
                            min="1"
                            max="20"
                            value={horizont}
                            onChange={(e) => setHorizont(e.target.value)}
                        />
                        <Button className='mt-20' onClick={handleShow}>Calcular</Button>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Rentabilidades</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {(daysQqq && daysSpy && daysMdy && endDate && startDate) ?
                                    `Considerando una inversión de ${investment} dolares, realizada hace ${horizont} años, se obtiene una rentabilidad total de ${profit(daysQqq[startDate]["4. close"], daysQqq[endDate]["4. close"]) + profit(daysSpy[startDate]["4. close"], daysSpy[endDate]["4. close"]) + profit(daysMdy[startDate]["4. close"], daysMdy[endDate]["4. close"])}% (${profit(daysQqq[startDate]["4. close"], daysQqq[endDate]["4. close"]) / 100 * investment / 3 + profit(daysSpy[startDate]["4. close"], daysSpy[endDate]["4. close"]) / 100 * investment / 3 + profit(daysMdy[startDate]["4. close"], daysMdy[endDate]["4. close"]) / 100 * investment / 3} dólares) teniendo en cuenta los siguientes valores.` : "Esperando APIs"}
                                <Etf
                                    name="QQQ"
                                    days={daysQqq}
                                    endDate={endDate}
                                    startDate={startDate}
                                    investment={investment / 3}
                                    horizont={horizont}
                                />
                                <Etf
                                    name="MDY"
                                    days={daysMdy}
                                    endDate={endDate}
                                    startDate={startDate}
                                    investment={investment / 3}
                                    horizont={horizont}
                                />
                                <Etf
                                    name="SPY"
                                    days={daysSpy}
                                    endDate={endDate}
                                    startDate={startDate}
                                    investment={investment / 3}
                                    horizont={horizont}
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={handleClose}>
                                    Cerrar
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Form.Group>
                </Form>
            </Stack>
        </div>
    );
}

export default App;
