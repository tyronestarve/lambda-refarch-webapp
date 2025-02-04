import React, { useState, useEffect } from 'react';
import { Container, Jumbotron, Row, Col, Alert, Button } from 'reactstrap';
import axios from 'axios';
import ToDo from './ToDo'

import './App.css';
import logo from './aws.png';

import config from './config';

function App() {
  const [alert, setAlert] = useState();
  const [alertStyle, setAlertStyle] = useState('info');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertDismissable, setAlertDismissable] = useState(false);
  const [idToken, setIdToken] = useState('');
  const [toDos, setToDos] = useState([]);

  useEffect(() => {
    // getIdToken();
    getAllTodos();
  },[]);

  axios.interceptors.response.use(response => {
    console.log('Response was received');
    return response;
  }, error => {
    // window.location.href = config.redirect_url;
    return Promise.reject(error);
  });

  function onDismiss() {
    setAlertVisible(false);
  }

  function updateAlert({ alert, style, visible, dismissable }) {
    setAlert(alert ? alert : '');
    setAlertStyle(style ? style : 'info');
    setAlertVisible(visible);
    setAlertDismissable(dismissable ? dismissable : null);
  }

  const clearCredentials = () => {
    console.log("clearCredentials........");
    window.location.href = config.redirect_url;
  }

  const getIdToken = () => {
    const hash = window.location.hash.substr(1);
    const objects = hash.split("&");
    objects.forEach(object => {
      const keyVal = object.split("=");
      if (keyVal[0] === "id_token") {
        setIdToken(keyVal[1]);
      }
    });
  };

  const getAllTodos = async () => {
    const result = await axios({
      url: `${config.api_base_url}/item/`,
      mode: "cors",
      headers: {
        'x-api-key': config.api_key
      }
    }).catch(error => {
      console.log(error);
    });

    console.log(result);

    if (result && result.status === 401) {
      console.log("401 rcved clearCredentials........");
      clearCredentials();
    } else if (result && result.status === 200) {
      console.log(result.data.Items);
      setToDos(result.data.Items);
    }
  };

  const addToDo = async (event) => {
    const newToDoInput = document.getElementById('newToDo');
    const item = newToDoInput.value;
    console.log(item);
    if (!item || item === '') return;

    const newToDo = {
      "item": item,
      "completed": false
    };

    const result = await axios({
      method: 'POST',
      url: `${config.api_base_url}/item/`,
      headers: {
        'x-api-key': config.api_key
      },
      data: newToDo
    });

    if (result && result.status === 401) {
      console.log("401 rcved clearCredentials........");
      clearCredentials();
    } else if (result && result.status === 200) {
      getAllTodos();
      newToDoInput.value = '';
    }
  }

  const deleteToDo = async (indexToRemove, itemId) => {
    if (indexToRemove === null) return;
    if (itemId === null) return;

    const result = await axios({
      method: 'DELETE',
      url: `${config.api_base_url}/item/${itemId}`,
      headers: {
        'x-api-key': config.api_key
      }
    });

    if (result && result.status === 401) {
      console.log("401 rcved clearCredentials........");
      clearCredentials();
    } else if (result && result.status === 200) {
      const newToDos = toDos.filter((item, index) => index !== indexToRemove);
      setToDos(newToDos);
    }
  }

  const completeToDo = async (itemId) => {
    if (itemId === null) return;

    const result = await axios({
      method: 'POST',
      url: `${config.api_base_url}/item/${itemId}/done`,
      headers: {
        "x-api-key" : config.api_key
      }
    });

    if (result && result.status === 200) {
      getAllTodos();
    }
  }

  return (
    <div className="App">
      <Container>
        <Alert color={alertStyle} isOpen={alertVisible} toggle={alertDismissable ? onDismiss : null}>
          <p dangerouslySetInnerHTML={{ __html: alert }}></p>
        </Alert>
        <Jumbotron>
          <Row>
            <Col md="6" className="logo">
              <h1>Serverless Todo</h1>
              <p>This is a demo that showcases AWS serverless.</p>
              <p>The application is built using the SAM CLI toolchain, and uses AWS Lambda, Amazon DynamoDB, and Amazon API Gateway for API services and Amazon Cognito for identity.</p>

              <img src={logo} alt="Logo" />
            </Col>
            <Col md="6">
              {idToken.length == 0 ?
                (
                  <ToDo updateAlert={updateAlert} toDos={toDos} addToDo={addToDo} deleteToDo={deleteToDo} completeToDo={completeToDo} />
                ) : (
                  <Button
                    href={`https://${config.cognito_hosted_domain}/login?response_type=token&scope=email+openid+profile&client_id=${config.aws_user_pools_web_client_id}&redirect_uri=${config.redirect_url}`}
                    //   href={`https://ec2-52-81-219-39.cn-north-1.compute.amazonaws.com.cn:8443/auth/realms/bmw/protocol/openid-connect/auth?client_id=tododemo&redirect_uri=https%3A%2F%2Fmaster.d1miyvz1qrjpmq.amplifyapp.com%2F%3F&response_type=id_token&scope=email+openid+profile&nonce=5956a0a9-80c6-40e1-8577-feb07a45ca24`}
                      color="primary"
                    className="mt-5 float-center"
                  >
                    Log In
                  </Button>
                )
              }
            </Col>
          </Row>
        </Jumbotron>
      </Container>
    </div >
  );
}

export default App;
