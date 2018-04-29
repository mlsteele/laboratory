import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import SelectPicker from './FormComponents/SelectPicker';
import TextPicker from './FormComponents/TextPicker.js';
import extrapolateFromXdr from '../utilities/extrapolateFromXdr';
import TreeView from './TreeView';
import validateBase64 from '../utilities/validateBase64';
import {updateXdrInput, updateXdrTypeFilter, updateXdrType, fetchLatestTx} from '../actions/xdrViewer';
import NETWORK from '../constants/network';

function XdrViewer(props) {
  let {dispatch, state, baseURL} = props;

  let validation = validateBase64(state.input);
  let messageClass = validation.result === 'error' ? 'xdrInput__message__alert' : 'xdrInput__message__success';
  let message = <p className={messageClass}>{validation.message}</p>

  let xdrTypeIsValid = _.indexOf(state.types, state.type) >= 0;
  let treeView, errorMessage;
  if (state.input === '') {
    errorMessage = <p>Enter a base-64 encoded XDR blob to decode.</p>;
  } else if (!xdrTypeIsValid) {
    errorMessage = <p>Please select a XDR type</p>;
  } else {
    try {
      treeView = <TreeView nodes={extrapolateFromXdr(state.input, state.type)} />
    } catch (e) {
      console.error(e)
      errorMessage = <p>Unable to decode input as {state.type}</p>;
    }
  }

  return <div>
    <div className="XdrViewer__setup so-back">
      <div className="so-chunk">
        <div className="pageIntro">
          <p><a href="https://www.stellar.org/developers/horizon/learn/xdr.html">External Data Representation (XDR)</a> is a standardized protocol that the Stellar network uses to encode data.</p>
          <p>The XDR Viewer is a tool that displays contents of a Stellar XDR blob in a human readable format.</p>
        </div>
        <p className="XdrViewer__label">
          Input a base-64 encoded XDR blob, or <a onClick={() => dispatch(fetchLatestTx(baseURL))}>fetch the latest transaction to try it out</a>:
        </p>
        <div className="xdrInput__input">
          <textarea
            value={state.input}
            className="xdrInput__input__textarea"
            onChange={(event) => dispatch(updateXdrInput(event.target.value))}
            placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."></textarea>
        </div>
        <div className="xdrInput__message">
          {message}
        </div>

        <p className="XdrViewer__label">XDR type:</p>
        <TextPicker
          value={state.typeSearch}
          placeholder="Search"
          onUpdate={(value) => dispatch(updateXdrTypeFilter(value))}
          className="XdrViewer__type_search"
          />
        <SelectPicker
          value={state.type}
          placeholder={"Select XDR type"}
          onUpdate={(input) => dispatch(updateXdrType(input))}
          items={state.types}
        />
      </div>
    </div>
    <div className="XdrViewer__results so-back">
      <div className="so-chunk">
        {errorMessage}
        {treeView}
      </div>
    </div>
  </div>
}

export default connect(chooseState)(XdrViewer);
function chooseState(state) {
  return {
    state: state.xdrViewer,
    baseURL: NETWORK.available[state.network.current].url,
  }
}
