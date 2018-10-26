import React, { Component } from 'react';

import axios from 'axios';

class Login extends Component {
  state = {
    email: '',
    password: '',
    user: null
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    try {
      const res = await axios
        .post('http://localhost:9009/api/v1/user/login', {
          email: this.state.email,
          password: this.state.password
        });
      console.log('-------------RES', res);
      if (res.data && res.data.data.user) {
        this.setState({
          user: res.data.data.user
        });
      }
    } catch(err) {
      console.error('ERR', err);
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="email"
            onChange={this.handleChange}
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={this.handleChange}
          />
          <br />
          <button type="submit">submit</button>
        </form>
        {this.state.user && <pre>{this.state.user._id}</pre>}
      </div>
    );
  }
}

export default Login;
