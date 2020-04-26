import React from 'react'

import classes from './Order.css'

const order = (props) => {
  const ingredients = []
  for (const iName in props.ingredients) {
    ingredients.push({
      name: iName,
      qty: props.ingredients[iName],
    })
  }

  const ingredientOutput = ingredients.map((ig) => (
    <span
      style={{
        textTransform: 'capitalize',
        display: 'inline-block',
        margin: '0 8px',
        border: '1px solid #ccc',
        padding: '5px',
      }}
    >
      {ig.name} ({ig.qty})
    </span>
  ))

  return (
    <div className={classes.Order}>
      <p>{ingredientOutput}</p>
      <p>
        Price: <strong>USD {props.price.toFixed(2)}</strong>
      </p>
    </div>
  )
}

export default order
