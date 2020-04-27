import React from 'react'
import classes from './Input.css'

const input = (props) => {
  let inputEl = null
  let errorMessage = null
  const inputClasses = [classes.InputElement]

  if(props.valid === false && props.touched === true) {
      inputClasses.push(classes.Invalid)
      errorMessage = <p className={classes.ValidationError}>Please enter a valid value</p>
  }

  switch (props.elementType) {
    case 'input':
      inputEl = (
        <input
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      )
      break
    case 'textarea':
      inputEl = (
        <textarea
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      )
      break
    case 'select':
      inputEl = (
        <select className={inputClasses.join(' ')} value={props.value} onChange={props.changed}>
          {props.elementConfig.options.map((nxtOpt) => (
            <option key={nxtOpt.value} value={nxtOpt.value}>
              {nxtOpt.displayValue}
            </option>
          ))}
        </select>
      )
      break
    default:
      inputEl = <input className={inputClasses.join(' ')} {...props.elementConfig} value={props.value} />
  }

  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputEl}
      {errorMessage}
    </div>
  )
}

export default input
