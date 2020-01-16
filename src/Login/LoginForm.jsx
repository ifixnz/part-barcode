import React from 'react';
import $ from 'jquery';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import * as WSSEAuthenticationHelper from './WSSEAuthenticationHelper.js';
import MainPanel from '../MainPanel/MainPanel.jsx';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        window.localStorage.setItem('loginUser', null);
        let usr = window.localStorage.getItem('loginUser')
        this.state = {
            username: '',
            password: '',
            user: usr == null ? null : JSON.parse(usr),
            errorMessage: null,
            cookieLogin: true
        };
        this.doSubmit = this.doSubmit.bind(this);
        this.doWSSEAuthentication = this.doWSSEAuthentication.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.loginFromCookie = this.loginFromCookie.bind(this);
        this.logout = this.logout.bind(this);
    }

    doSubmit(event) {
        event.preventDefault();
        console.log('username=' + this.state.username + "&password=" + this.state.password);
        $.post('/api/users/getSalt', 'username=' + this.state.username,
        data => {
            console.log('salt:' + data);
            this.doWSSEAuthentication(data);
        }, 'json').fail(data => {
            try {
                this.setState({user: null,
                    errorMessage: JSON.parse(data.responseText).message});
            } catch (e) {
                this.setState({user: null,
                    errorMessage: 'Failed to contact PartKeepr server'});
            }
        });
    }

    doWSSEAuthentication(userSalt) {
        // export function getWSSE(username, password, salt, creationDate = null, nonceLength = 16)
        let wsseToken = WSSEAuthenticationHelper.getWSSE(
            this.state.username,
            this.state.password,
            userSalt
        );
        $.ajax('api/users/login', {
            type: 'POST',
            beforeSend: function(xhrObj) {
                xhrObj.setRequestHeader("Authorization", 'WSSE profile="UsernameToken"');
                xhrObj.setRequestHeader('X-WSSE', wsseToken);
                console.log('Set WSSE:' + wsseToken);
            },
            success: data => {
                console.log(data);
                this.setState({user: data});
            },
/*{
  "@context": "/api/contexts/User",
  "@id": "/api/users/1",
  "@type": "User",
  "username": "Admin",
  "password": null,
  "newPassword": null,
  "email": null,
  "legacy": false,
  "provider": {
    "@id": "/api/user_providers/1",
    "@type": "UserProvider",
    "type": "Builtin",
    "editable": true
  },
  "initialUserPreferences": "[{\"preferenceKey\":\"partkeepr.formatting.currency.currencySymbolAtEnd\",\"preferenceValue\":\"false\"},{\"preferenceKey\":\"partkeepr.formatting.currency.numdecimals\",\"preferenceValue\":\"2\"},{\"preferenceKey\":\"partkeepr.formatting.currency.symbol\",\"preferenceValue\":\"\\\"\\\\u00a5\\\"\"},{\"preferenceKey\":\"partkeepr.formatting.currency.thousandsSeparator\",\"preferenceValue\":\"true\"},{\"preferenceKey\":\"partkeepr.tipoftheday.showtips\",\"preferenceValue\":\"false\"},{\"preferenceKey\":\"partkeepr.user.theme\",\"preferenceValue\":\"\\\"classic\\\"\"}]",
  "active": true,
  "protected": false
} */
            error: data => {
                try {
                    this.setState({user: null,
                        errorMessage: JSON.parse(data.responseText).message});
                } catch (e) {
                    this.setState({user: null,
                        errorMessage: 'Failed to login'});
                }
            }
        });
    }

    passwordChange(event) {
        this.setState({password: event.target.value});
    }

    usernameChange(event) {
        this.setState({username: event.target.value});
    }

    componentDidMount() {
        this.loginFromCookie();
    }

    loginFromCookie() {
        /*
        $.ajax({
            type: 'GET',
            url: '/api/user/login',
            success: data => {
                this.setState({user: data, cookieLogin: false});
            },
            error: () => {
                this.setState({user: null, cookieLogin: false});
            }
        });*/
        this.setState({user: null, cookieLogin: false});
    }

    logout() {
    }

    render() {
        if (this.state.cookieLogin) {
            return (<p>Loading...</p>);
        }
        if (this.state.user != null) {
            return (<MainPanel user={this.state.user}/>);
        }
        let error = null;
        if (this.state.errorMessage != null) {
            error = (<Row bsPrefix="row mt-2"><Col>
                        <Alert variant="danger">{this.state.errorMessage}</Alert>
                    </Col></Row>);
        }
        return (
        <Container>
            <Row bsPrefix="row mt-2"><Col>
                <h3>Please login with Partkeepr username and password.</h3>
            </Col></Row>
            {error}
            <Row bsPrefix="row mt-2"><Col>
                <Form onSubmit={this.doSubmit}>
                    <Form.Group controlId="username1">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Username"
                                      value={this.state.username} onChange={this.usernameChange} />
                    </Form.Group>
                        <Form.Group controlId="password1">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password"
                                      value={this.state.password} onChange={this.passwordChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Login</Button>
                </Form>
            </Col></Row>
        </Container>);
    }
}

export default LoginForm;
