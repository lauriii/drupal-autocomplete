import React from 'react';
import './App.css';
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
  }

  fetchPosts = () => {
    this.setState({ isFetching: true });
    fetch('https://jsonplaceholder.typicode.com/posts').then((response) => {
      return response.json();
    })
    .then((result) => {
      const options = result.map((post) => {
        return { value: post.id, label: post.title };
      });
      this.setState({ options: options });
    });
  };

  handleChange = selectedOption => {
    this.setState({ ...this.state, selectedOption }, () => {
      this.selectRef.current.focus();
    });
    console.log(`Option selected:`, selectedOption);
  };

  handleInputChange(newValue) {
    if (!newValue) {
      this.setState({ options: null });
    } else {
      this.fetchPosts();
    }
    this.setState( { inputValue: newValue });
  }

  render() {
    const { selectedOption, options, inputValue } = this.state;

    return (
      <div className="app">
        <Creatable
          inputValue={inputValue}
          components={components}
          value={selectedOption}
          options={options}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          isMulti
          ref={this.selectRef}
          menuIsOpen={options !== null ? undefined : false}
        />
      </div>
    );
  }
}

export default App;
