import React from 'react';
import Creatable from 'react-select/creatable';

const components = {
  DropdownIndicator: null,
};

class App extends React.Component {
  state = {
    selectedOption: null,
    isFetching: null,
    options: null,
    inputValue: '',

  };

  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.selectRef = React.createRef();
    this.isMulti = this.props.cardinality !== "1";
  }

  componentWillMount = () => {
    this.defaultValue = this.props.attributes.value.split(',').map(item => {
      const label = item.substring(0, item.indexOf('('));
      return { label: item.trim(), value: label.trim() };
    }).filter(item => item.value.length > 0);
    if (this.defaultValue.length > 0) {
      this.setState({ selectedOption: this.defaultValue});
    }
  }

  fetchResults = () => {
    this.setState({ isFetching: true });
    const apiUrl = `${this.props.endpoint}?q=${this.state.inputValue}`;
    fetch(apiUrl).then((response) => {
      return response.json();
    })
      .then((result) => {
        const options = result.map((item) => {
          return { value: item.label, label: item.value };
        });
        this.setState({ options: options });
      });
  };

  handleChange = (selectedOption, event) => {
    this.setState({ ...this.state, inputValue: '', selectedOption }, () => {
      this.selectRef.current.focus();
      let values = '';
      if (this.isMulti) {
        values = this.state.selectedOption.map(item => item.label).join(', ');
      } else {
        values = this.state.selectedOption.label;
      }
      const hiddenId = this.props.attributes.id;

      document.getElementById(hiddenId).value = values.trim();
    });

  };

  handleInputChange = (newValue, whatever) => {
    this.setState( { inputValue: newValue }, () => {
      if (newValue) {
        this.fetchResults();
      } else {
        this.setState({ options: [] });
      }
    });
  }

  render () {
    const { selectedOption, options, inputValue } = this.state;
    return (
      <Creatable
        inputValue={inputValue}
        components={components}
        defaultValue={this.props.attributes.value}
        value={selectedOption}
        options={options}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        isMulti={this.props.cardinality !== "1"}
        ref={this.selectRef}
        menuIsOpen={options !== null ? undefined : false}
        inputId={this.props.inputId}
      />
    );
  }
}

export default App;
