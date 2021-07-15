# Call-Center
Solution to CTC OOD Question

Imagine you have a call center with three levels of employees: respondent, manager, and director. An incoming telephone call must be first allocated to a respondent who is free. If the respondent can’t handle the call, he or she must escalate the call to a manager. If the manager is not free or not able to handle it, then the call should be escalated to a director. Design the classes and data structures for this problem. Implement a method dispatchCall() which assigns a call to the first available employee.


To run in ts-node:

import {CallCenter} from './call-center/index'
import {CallCreator} from './calls/index'
const callCenter = new CallCenter()
const callCreator = new CallCreator()

const call1 = callCreator.create()
callCenter.dispatchIncommingCall(call1)
console.log(callCenter)
