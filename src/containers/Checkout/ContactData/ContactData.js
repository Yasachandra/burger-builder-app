import React, { Component } from 'react'
import { connect } from "react-redux";

import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'
import axios from '../../../axios'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code',
        },
        value: '',
        validation: {
          required: true,
          minLength: 6,
          maxLength: 6,
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your E-mail',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {
              value: 'fastest',
              displayValue: 'Fastest',
            },
            {
              value: 'cheapest',
              displayValue: 'Cheapest',
            },
          ],
        },
        value: 'cheapest',
        valid: true
      },
    },
    formIsValid: false,
  }

  orderHandler = (evt) => {
    evt.preventDefault()
    this.setState({
      loading: true,
    })

    const formData = {}
    for (const key in this.state.orderForm) {
      formData[key] = this.state.orderForm[key].value
    }

    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData,
    }
    this.props.onOrderBurger(order);
  }

  inputChangedHandler = (evt, id) => {
    const updatedOrderForm = { ...this.state.orderForm }
    const updatedFormElemet = { ...updatedOrderForm[id] }
    updatedFormElemet.value = evt.target.value
    updatedFormElemet.valid = this.checkValidity(evt.target.value, updatedFormElemet.validation)
    updatedFormElemet.touched = true
    updatedOrderForm[id] = updatedFormElemet

    let formIsValid = true
    for (const key in updatedOrderForm) {
      formIsValid = updatedOrderForm[key].valid && formIsValid
    }

    this.setState({
      orderForm: updatedOrderForm,
      formIsValid 
    })
  }

  checkValidity(value, rules) {
    let isValid = true

    if (rules && rules.required) isValid = value.trim() !== '' && isValid

    if (rules && rules.minLength) isValid = value.length >= rules.minLength && isValid

    if (rules && rules.maxLength) isValid = value.length <= rules.maxLength && isValid

    return isValid
  }

  render() {
    const formElementsArray = []
    for (const key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key],
      })
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map((nextEl) => (
          <Input
            key={nextEl.id}
            {...nextEl.config}
            changed={(evt) => this.inputChangedHandler(evt, nextEl.id)}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
      </form>
    )
    if (this.props.loading) form = <Spinner />
    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    loading: state.order.loading,
    price: state.burgerBuilder.totalPrice
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onOrderBurger: (order) => dispatch(actions.purchaseBurger(order))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
