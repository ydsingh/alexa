/**
 * Copyright 2020 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
 * 
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 * http://aws.amazon.com/asl/
 * 
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
**/
'use strict';

const daily_specials = {
  sunday : {
    lunch : {
      pizza : {
        size: "small", 
        crust: "thin crust",
        cheese : "extra", 
        toppingsList : ["pineapple", "canadian bacon"]
      },
      salad : "small caesar salad",
      drinks : "large iced tea",
      cost : 10.99
    },
    dinner : {
      pizza : {
        size: "extra large", 
        crust: "deep dish",
        cheese : "normal", 
        toppingsList : ["ham", "pepperoni", "sausage", "black olives"]
      },
      salad : "large house salad",
      drinks : "2 liter coke",
      side : "cheesy garlic bread",
      dessert : "two homemade chocolate fudge cookies",
      cost : 21.99
    }
  },
  monday : {
    lunch : {
      pizza : {
        size: "small", 
        crust: "regular",
        cheese : "extra", 
        toppingsList : ["pepperoni", "olives"]
      },
      salad : "small house salad",
      drinks : "diet coke",
      cost : 10.99
    },
    dinner : {
      pizza : {
        size: "large", 
        crust: "regular",
        cheese : "extra", 
        toppingsList : ["kalamata olives", "artichoke hearts", "feta cheese"]
      },
      salad : "large caesar salad",
      drinks: "2 liter sprite",
      side: "parmesean bread bites",
      dessert: "a family size fudge brownie",
      cost : 14.99
    }
  },
  tuesday : {
    lunch : {
      pizza : {
        size: "medium", 
        crust: "brooklyn style",
        cheese : "regular", 
        toppingsList : ["pepperoni"]
      },
      salad : "small caesar salad",
      drinks : "sprite",
      cost : 11.99
    },
    dinner : {
      pizza : {
        size: "extra large", 
        crust: "brooklyn style",
        cheese : "normal", 
        toppingsList : ["tomato", "basil", "ricotta cheese"]
      },
      salad : "small house salad",
      drinks: "one liter San Pelligrino",
      dessert: "chocolate dipped strawberries",
      side: "basil garlic toast",
      cost : 14.99
    }
  },
  wednesday : {
    lunch : {
      pizza : {
        size: "small", 
        crust: "thin",
        cheese : "normal", 
        toppingsList : ["parmesean flakes", "olive oil"]
      },
      salad : "small caesar salad",
      drinks : "large iced tea",
      cost : 10.99
    },
    dinner : {
      pizza : {
        size: "large", 
        crust: "thin",
        cheese : "light", 
        toppingsList : ["chicken", "spinach", "mushroom"]
      },
      salad : "large caesar salad",
      drinks : "2 liter diet coke",
      dessert : "a box of pocky sticks",
      side : "garlic bread sticks",
      cost : 19.99
    }
  },
  thursday : {
    lunch : {
      pizza : {
        size: "small", 
        crust: "regular",
        cheese : "extra", 
        toppingsList : ["bacon", "canadian bacon", "sausage"]
      },
      salad : "small house salad",
      drinks : "diet coke",
      cost : 9.99
    },
    dinner : {
      pizza : {
        size: "extra large", 
        crust: "regular",
        cheese : "light", 
        toppingsList : ["tomato", "onion", "garlic"]
      },
      salad : "small house salad",
      side: "olive tapenade and fresh sliced bread",
      drinks: "a two liter sprite",
      dessert : "small apple pie",
      cost : 18.99
    }
  },
  friday : {
    lunch : {
      pizza : {
        size: "medium", 
        crust: "regular",
        cheese : "light", 
        toppingsList : ["sausage", "onion", "sweet peppers"]
      },
      salad : "small caesar salad",
      drinks: "iced tea",
      cost : 10.99
    },
    dinner : {
      pizza : {
        size: "extra large", 
        crust: "deep dish",
        cheese : "normal", 
        toppingsList : ["ham", "pepperoni", "sausage", "black olives"]
      },
      salad : "large house salad",
      drinks : "2 liter coke",
      side : "ranch cheesy bites with dipping sauce",
      dessert : "a truffle brownie",
      cost : 22.99
    }
  },
  saturday : {
    lunch : {
      pizza : {
        size: "small", 
        crust: "brooklyn style",
        cheese : "extra", 
        toppingsList : ["tomato", "basil"]
      },
      salad : "small house salad",
      drinks : "large iced tea",
      cost : 10.99
    },
    dinner : {
      pizza : {
        size: "extra large", 
        crust: "thin",
        cheese : "normal", 
        toppingsList : ["pineapple", "canadian bacon"]
      },
      salad : "large house salad",
      drinks: "two, two liter cokes",
      dessert: "homemade raspberry pie",
      side : "ranch cheesy bites with dipping sauce",
      cost : 18.99
    }
  },
};
const specials = [
  { 
    name : "three cheese delight", 
    qty: 1, 
    pizza: { 
      size: "large", 
      crust: "deep dish",
      cheese : "extra", 
      toppingsList : ["asiago", "mozzarella blend", "ricotta"]
    },
    cost: 12.99
  },
  { 
    name : "pepperoni party", 
    qty: 1, 
    pizza : {
      size: "extra large",
      crust: "regular",
      cheese : "extra", 
      toppingsList : ["old world dry aged pepperoni", "molinari pepperoni", "pepper crusted pepperoni", "fresh basil", "roasted ricotta medallions"]
    },
    cost: 10.99
  },
  {
    name : "meat lovers", 
    qty: 1, 
    pizza : {
      size: "large",
      crust: "regular",
      cheese : "light", 
      toppingsList : ['sausage', 'pepperoni', 'ham', 'bacon']
    },
    cost: 9.99
  },
  {
    name : "veggie supreme", 
    qty: 1, 
    pizza: {
      size: "large",
      crust: "thin",
      cheese : "normal", 
      toppingsList: ["spinach", "olives", "mushrooms", "onions", "artichoke hearts"]
    },
    cost: 8.99
  },
  {
    name : "kitchen sink", 
    qty: 1, 
    pizza: {
      size: "extra large",
      crust: "deep dish",
      cheese : "extra", 
      toppingsList: ["ham", "bacon", "pepperoni", "sausage", "onions", "black olives", "green peppers", "jalapenos", "feta cheese"]
    },
    cost: 13.99
  },
  {
    name : "two medium, two topping pizzas", 
    qty: 2, 
    pizza: {
      size: "medium",
      crust: "regular",
      cheese: "normal", 
      toppingsList: ["your choice of two toppings"]
    },
    cost: 10.99
}];
const pizza_costs = {
  "small": 5.99,
  "medium": 7.99,
  "large": 10.99,
  "extra large" : 13.99
}
const feeding_size = {
  "small" : "around one adult",
  "medium" : "around two adults",
  "large" : "between two and three adults",
  "extra large" : "three to four adults"
}
const salad_costs = {
  "small" : 4.99,
  "large" : 7.99,
  "custom" : 6.99
}
const salads = [
  "small house salad",
  "large house salad",
  "small caesar salad",
  "large casaer salad"
];
const sides = [
  {name: "garlic bread sticks", cost: 4.99},
  {name: "ranch cheesy bites with dipping sauce", cost: 5.99},
  {name: "cheesy garlic bread", cost: 5.99}
];
const desserts = [
  {name: "truffle brownie", cost: 1},
  {name: "small apple pie", cost: 3.99},
  {name: "homemade chocolate fudge cookies", cost: 1.50}
];
const drinks = [
  {name: "iced tea", cost: 1.99},
  {name: "lemonade", cost: 1.99},
  {name: "sprite", cost: 1.99},
  {name: "water", cost: 1.99},
  {name: "pepsi", cost: 1.99},
  {name: "diet coke", cost: 1.99},
  {name: "coke", cost: 1.99},
  {name: "two liter coke", cost: 3.99},
  {name: "two liter diet coke", cost: 3.99},
  {name: "two liter sprite", cost: 3.99},
  {name: "two liter pepsi", cost: 3.99}
]
const generateOrderText = (order) => {
  let orderText = ""
  let cost = 0;
  if (order.special){
    orderText = "a " + order.special.name + " special that comes with ";
    orderText += order.special.qty + " " + order.special.pizza.size + " ";
    let speakableToppings = order.special.pizza.toppingsList;
    let lastTopping = " and " + speakableToppings.pop();
    orderText += speakableToppings.join(", ") + lastTopping + " pizza";
    orderText += " on " + order.special.pizza.crust + " crust";
    orderText += " with " + order.special.pizza.cheese + " cheese";
    if (order.special.cost){
      cost += order.special.cost;
    }
  }
  if (order.pizza){
      orderText += "a " + order.pizza.size + " ";
      let speakableToppings = order.pizza.toppingsList;
      let lastTopping = " and " + speakableToppings.pop();
      orderText += speakableToppings.join(", ") + lastTopping + " pizza";
      orderText += " on " + order.pizza.crust + " crust";
      orderText += " with " + order.pizza.cheese + " cheese";
      cost += getPizzaCost(order.pizza.size);
  } 
  if (order.salad){
      if (orderText != null){
          orderText += ", ";
      }
      orderText += "a " + order.salad;
      cost += getSaladCost(order.salad);
  }
  if (order.drinks){
      if (orderText != null){
          orderText += ", ";
      }
      if (!order.side && !order.dessert){
        orderText += " and ";
      }
      orderText += "a " + order.drinks;
      cost += getDrinkCost(order.drinks);
  }
  if (order.side){
      if (orderText != null){
          orderText += ", ";
      }
      if (!order.dessert){
        orderText += " and ";
      }
      orderText += "a side order of " + order.side;
      cost += getSideCost(order.side);
  }
  if (order.dessert){
      if (orderText != null){
          orderText += ", and ";
      }
      orderText += order.dessert;
      cost += getDessertCost(order.dessert);
  }
  orderText += " for a total of $" + cost;
  
  return orderText;
}
const getDailySpecialForPeriod = (day, period) => {
  return daily_specials[day][period];
};
const getPizzaReferenceSpecials = () => {
    return specials.map(function (special) {
        return special.name
      })
}
const getSpecialPizzaDetails = (specialPizzaName) => {
    console.log("In getSpecialPizzaDetails, looking for: " + specialPizzaName);
    if (!getPizzaReferenceSpecials().includes(specialPizzaName)){
        return null;
    }
    let special = specials.find(special => 
      (special.name.toLowerCase() === specialPizzaName) || (special.name.toLowerCase().includes(specialPizzaName)));
    return special;
}
const getPizzaCost = (size) => {
  return pizza_costs[size];
}
const getSaladCost = (salad) => {
  let cost;
  ['small', 'large', 'custom'].forEach( type => {
    if (salad.includes(type)){
      cost = salad_costs[type];
    }
  });
  return cost;
}
const getSpecialCost = (name) => {
  return specials.find(s => s.name == name).cost;
}
const getDrinkCost = (drink) => {
  // silly since all drinks cost $1.99 but this give you the chance to alter the menu 
  // and not affect the logic
  return drinks.find(d => d.name == drink).cost;
}
const getSideCost = (side) => {
  return sides.find(s => s.name == side).cost;
}
const getDessertCost = (dessert) => {
  return desserts.find(d => d.name == dessert).cost;
}
const getSides = () => {
  return sides.map(side => side.name);
}
const getSalads = () => {
  return salads.map(salad => salad.name);
}
const getDesserts = () => {
  return desserts.map(dessert => dessert.name);
}
const getDrinks = () => {
  return drinks.map(drink => drink.name);
}
const getFeedingSize = (size) => {
  return feeding_size[size];
}
const makeSpeakableList =  (list) => {
  if (list.length > 1){
    let last = " and " + list.pop();
    return list.join(", ") + last;
  }
  return list;
  
}
module.exports = { 
  getDailySpecialForPeriod,
  getPizzaReferenceSpecials, 
  getSpecialPizzaDetails, 
  getSpecialCost,
  getSaladCost,
  getSides, 
  getSalads, 
  getDesserts,
  getDrinks,
  generateOrderText,
  getFeedingSize,
  makeSpeakableList
};
