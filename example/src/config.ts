export const labels = {
  "#fruitsOrVeggies": {
    constant: "Fruits/Vegetables"
  },
  "#veggie": {
    property: "veggieName"
  }
}

export const modelMapping = {
  attribute: 'type',
  mapping: {
    fruitsOrVeggies: '#fruitsOrVeggies',
    veggies: '#veggies'
  }
};

export const uischemas = {
  '#fruitsOrVeggies': {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/fruits'
      },
      {
        type: 'Control',
        scope: '#/properties/vegetables'
      }
    ]
  },
  '#veggie': {
    type: 'HorizontalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/veggieName'
      },
      {
        type: 'Control',
        scope: '#/properties/veggieLike'
      }
    ]
  }
};
