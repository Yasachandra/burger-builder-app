import React, { Component } from "react";
import { connect } from "react-redux";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.css";
import * as actions from "../../store/actions";

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Mail Address",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password",
        },
        value: "",
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
      },
    },
  };

  inputChangedHandler = (evt, id) => {
    const updatedControls = {
      ...this.state.controls,
      [id]: {
        ...this.state.controls[id],
        value: evt.target.value,
        valid: this.checkValidity(evt.target.value, this.state.controls[id].validation),
        touched: true,
      },
    };

    this.setState({
      controls: updatedControls,
    });
  };

  checkValidity(value, rules) {
    let isValid = true;

    if (rules && rules.required) isValid = value.trim() !== "" && isValid;

    if (rules && rules.minLength) isValid = value.length >= rules.minLength && isValid;

    if (rules && rules.maxLength) isValid = value.length <= rules.maxLength && isValid;

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules && rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  }

  submitHandler = (event) => {
    event.preventDefault();
    const { email, password } = this.state.controls;
    this.props.onAuth(email.value, password.value);
  }

  render() {
    const formElementsArray = [];
    for (const key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    const form = formElementsArray.map((nextEl) => (
      <Input key={nextEl.id} {...nextEl.config} changed={(evt) => this.inputChangedHandler(evt, nextEl.id)} />
    ));
    return (
      <div className={classes.Auth}>
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (em, pd) => dispatch(actions.auth(em, pd)),
  };
};

export default connect(null, mapDispatchToProps)(Auth);
