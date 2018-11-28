import React from "react";
import Enzyme, { shallow, render, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createSerializer } from "enzyme-to-json";
import sinon from "sinon";
import { MemoryRouter } from 'react-router-dom';

// Set the default serializer for Jest to be the from enzyme-to-json
// This produces an easier to read (for humans) serialized format.
expect.addSnapshotSerializer(createSerializer({ mode: "deep" }));

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

import Comp1 from "./Comp1.js";

function clickTestFn() {
}

test("renders correctly", () => {
  const spy = sinon.spy(Comp1.prototype, 'searchChange');
  const wrapper = mount(
    <MemoryRouter>
      <Comp1 text="Test text" inc_value={clickTestFn}/>
    </MemoryRouter>
  );
  const Comp1Wrapper = wrapper.find('Comp1');
  const p1Wrapper = Comp1Wrapper.find('p').first();
  const inputWrapper = Comp1Wrapper.find('p').at(1).find('input').first();

  expect(p1Wrapper.html()).toEqual("<p>Test text</p>");
  expect(inputWrapper.props().value).toEqual("Default");
  inputWrapper.simulate('change', {target: {value: 'new value'}});
  expect(spy.calledOnce).toEqual(true);
  spy.restore();
});
