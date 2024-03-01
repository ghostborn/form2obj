function form2obj(form) {
  const fields = formToArr(form)
  fields.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
  console.log(fields,'fields')
  return fields.reduce((obj, field) => {
    addProp(obj, field.name, field.value)
    return obj
  }, {})

  function addProp(o, prop, val) {
    const props = prop.split('.')
    const lastProp = props.length - 1
    props.reduce((obj, prop, i) => {
      return setProp(obj, prop, i === lastProp ? val : {})
    }, o)
  }

  function setProp(obj, name, val) {
    if (name.slice(-2) === '[]') {
      makeArr(obj, name).push(val)
    } else if (obj[name]) {
      return obj[name]
    } else if (name[name.length - 1] === ']') {
      const arr = makeArr(obj, name)
      if (arr.prevName === name) {
        return arr[arr.length - 1]
      }
      arr.push(val)
      arr.prevName = name
    } else {
      obj[name] = val
    }
    console.log(val, 'val')
    return val
  }

  function makeArr(obj, name) {
    const arrName = name.replace(/\[\d*\]/, '');
    return (obj[arrName] || (obj[arrName] = []))
  }

  function formToArr(form) {
    const inputs = form.querySelectorAll('input,textarea,select,[contenteditable=true]')
    const arr = []
    for (let i = 0; i < inputs.length; ++i) {
      let input = inputs[i],
        name = input.name || input.getAttribute('data-name'),
        value = input.value;

      if (!name || ((input.type === 'checkbox' || input.type === 'radio') && !input.checked)) {
        continue
      }
      if (input.getAttribute('contenteditable') === 'true') {
        value = input.innerHTML
      }
      arr.push({
        name,
        value
      })
    }
    return arr
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = form2obj
}
