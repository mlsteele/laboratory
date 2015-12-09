import PickerGenerator from './PickerGenerator';
import {operationsMap} from '../../data/operations.js';
import _ from 'lodash';

export default PickerGenerator({
  pickerName: 'OperationType',
  fields: [{
    type: 'radio',
    // TODO: Make this a select dropdown
    options: _.map(operationsMap, (op) => {
      return {
        name: op.id,
        label: op.label,
        value: op.id,
      };
    }),
    name: 'order',
    validator: value => null,
  }],
});
