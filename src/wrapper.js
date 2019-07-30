import ReactDOM from 'react-dom'
import React, { createElement } from 'react';
import Autocomplete from './autocomplete'
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

// function drupalAutocomplete (options) {
//   if (!options.element) { throw new Error('element is not defined') }
//   if (!options.id) { throw new Error('id is not defined') }
//   if (!options.source) { throw new Error('source is not defined') }
//   if (Array.isArray(options.source)) {
//     options.source = createSimpleEngine(options.source)
//   }
//   ReactDOM.render(<Autocomplete {...options} />, options.element)
// }



// function drupalAutocomplete (options) {
//   console.log('accessible options lololol', options);
//
//   ReactDOM.render(<Select {...options} />, document.getElementById(options.id))
// }

function drupalAutocomplete (options) {
 // console.log('big bad autocomplete', options);
  // if (!options.element) { throw new Error('element is not defined') }
  // if (!options.id) { throw new Error('id is not defined') }
  // if (!options.source) { throw new Error('source is not defined') }
  // if (Array.isArray(options.source)) {
  //   options.source = createSimpleEngine(options.source)
  // }
 // ReactDOM.render(<Autocomplete {...options} />, options.element)
  ReactDOM.render(<Autocomplete {...options} />, document.getElementById(options.wrapperid));
}



const createSimpleEngine = (values) => (query, syncResults) => {
  var matches = values.filter(r => r.toLowerCase().indexOf(query.toLowerCase()) !== -1)
  syncResults(matches)
}

drupalAutocomplete.enhanceSelectElement = (configurationOptions) => {
  if (!configurationOptions.selectElement) { throw new Error('selectElement is not defined') }

  // Set defaults.
  if (!configurationOptions.source) {
    let availableOptions = [].filter.call(configurationOptions.selectElement.options, option => (option.value || configurationOptions.preserveNullOptions))
    configurationOptions.source = availableOptions.map(option => option.textContent || option.innerText)
  }
  configurationOptions.onConfirm = configurationOptions.onConfirm || (query => {
    const requestedOption = [].filter.call(configurationOptions.selectElement.options, option => (option.textContent || option.innerText) === query)[0]
    if (requestedOption) { requestedOption.selected = true }
  })

  if (configurationOptions.selectElement.value || configurationOptions.defaultValue === undefined) {
    const option = configurationOptions.selectElement.options[configurationOptions.selectElement.options.selectedIndex]
    configurationOptions.defaultValue = option.textContent || option.innerText
  }

  if (configurationOptions.name === undefined) configurationOptions.name = ''
  if (configurationOptions.id === undefined) {
    if (configurationOptions.selectElement.id === undefined) {
      configurationOptions.id = ''
    } else {
      configurationOptions.id = configurationOptions.selectElement.id
    }
  }
  if (configurationOptions.autoselect === undefined) configurationOptions.autoselect = true

  const element = document.createElement('span')

  configurationOptions.selectElement.parentNode.insertBefore(element, configurationOptions.selectElement)

  drupalAutocomplete({
    ...configurationOptions,
    element: element
  })

  configurationOptions.selectElement.style.display = 'none'
  configurationOptions.selectElement.id = configurationOptions.selectElement.id + '-select'
}

export default drupalAutocomplete
