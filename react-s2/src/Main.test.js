import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { MemoryRouter } from 'react-router-dom';
import { fetchMock } from 'fetch-mock';

// http://airbnb.io/enzyme/docs/installation/index.html
configure({ adapter: new Adapter() })

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test("inits state correctly and renders", () => {
  const wrapper = shallow(
    <Main initialValue={10} />
  )
  expect(wrapper.state()).toEqual({value: 10, title: "", explanation: ""});
  expect(wrapper).toMatchSnapshot();
});

describe('testing api', () => {

  test('obtains remote data (simulated)', async () => {
    fetchMock.get('*', { title: "ABC", explanation: "123" });
    const wrapper = mount(
      <MemoryRouter>
        <Main initialValue={8} />
      </MemoryRouter>
    )
    const mainWrapper = wrapper.find('Main')
    expect(mainWrapper.state()).toEqual(
      {value: 8, title: "", explanation: ""}
    );
    // Need a delay for componentDidMount to execute and subsequent render
    await sleep(200);

    expect(mainWrapper.state()).toEqual(
      {value: 8,  title: "ABC", explanation: "123"}
    );
    const Comp2Wrapper = mainWrapper.find('Comp2');
    expect(Comp2Wrapper.instance().props).toEqual(
      {value: 8,  title: "ABC", explanation: "123"}
    );
    fetchMock.restore();
  })

  test('correct API call', async () => {
    const wrapper = shallow(
      <Main initialValue={8} />
    )
    fetchMock.get('*', { title: "ABC", explanation: "123" });
    await wrapper.instance().componentDidMount();
    expect(fetchMock.lastCall()[0]).toEqual(
      "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
    )
    fetchMock.restore();
  })
})
