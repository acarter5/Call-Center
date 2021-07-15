import { ResponsibilityLevel } from './types'
import { Call } from '../calls/index'
import { CallCenter } from '../call-center/index'
import { Status } from '../calls/types'

abstract class BaseEmployee {
    protected isAvailable = true
    constructor(
        public employeeId: number,
        protected responsibilityLevel: ResponsibilityLevel,
        protected callCenter: CallCenter
    ) {}

    markAvailable() {
        //change this.isAvailabe to true
        //place in available que
        this.isAvailable = true

        if (this instanceof Respondent) {
            this.callCenter.availableRespondents.enqueue(this)
            this.callCenter.checkUnansweredCallsQue()
        } else if (this instanceof Manager) {
            this.callCenter.availableManagers.enqueue(this)
        } else if (this instanceof Director) {
            this.callCenter.availableDirectors.enqueue(this)
            this.callCenter.checkUnansweredSevereCallsQue()
        }

        // this.callCenter['available' + this.responsibilityLevel + 's'].enqueue(
        //     this
        // )

        //check appropriate call que
        // managers don't have a queue of calls they need to look @ when they become available (only respondents and directors do)
        // if (this.responsibilityLevel === ResponsibilityLevel.Respondent) {
        //     this.callCenter.checkUnansweredCallsQue()
        // } else if (this.responsibilityLevel === ResponsibilityLevel.Director) {
        //     this.callCenter.checkUnansweredSevereCallsQue()
        // }
    }

    markUnavailable() {
        //change this.isAvailabe to false

        //note: employee has already been removed from the availabilty que by the callCenter
        this.isAvailable = false
    }

    assessCallSeverity(call: Call): ResponsibilityLevel {
        //determine whether call serverity needs to be bumped up or not (for our purposes, make this random)
        //made it so there's a 25% chance that a call needs to be escalted
        const rando: number = Math.random() * 100
        if (rando <= 75) {
            call.changeSeverity(this.responsibilityLevel)
        } else {
            if (this.responsibilityLevel === ResponsibilityLevel.Respondent) {
                call.changeSeverity(ResponsibilityLevel.Manager)
            } else {
                call.changeSeverity(ResponsibilityLevel.Director)
            }
        }

        return call.severity as ResponsibilityLevel
    }

    resolveCall(call: Call) {
        //add resolved message to call's log
        //place call in CallCenter's resolvedCalls list
        // mark employee as available

        call.changeStatus(Status.Resolved)
        call.addLog(
            `resolved by ${this.responsibilityLevel} ${this.employeeId}`
        )
        this.callCenter.resolvedCalls.push(call)
        this.markAvailable()
    }
}

export class Respondent extends BaseEmployee {
    constructor(id: number, callCenter: CallCenter) {
        super(id, ResponsibilityLevel.Respondent, callCenter)
    }

    intakeCall(call: Call) {
        /*
            mark unavailable
            determine severity of call
                if not correct level
                    escalate
                else
                    resolve
        */
        this.markUnavailable()
        const severity = this.assessCallSeverity(call)
        if (severity !== this.responsibilityLevel) {
            this.escalateToManager(call)
        } else {
            this.resolveCall(call)
        }
    }

    escalateToManager(call: Call) {
        //CallCenter.dispatchToManger()
        call.addLog(
            `escalted to manger by ${this.responsibilityLevel} ${this.employeeId}`
        )
        this.callCenter.dispatchToManager(call)
        this.markAvailable()
    }
}

export class Manager extends BaseEmployee {
    constructor(id: number, callCenter: CallCenter) {
        super(id, ResponsibilityLevel.Manager, callCenter)
    }

    intakeCall(call: Call) {
        /*
            mark unavailable
            determine severity of call
                if not correct level
                    escalate
                else
                    resolve
        */
        this.markUnavailable()
        const severity = this.assessCallSeverity(call)
        if (severity !== this.responsibilityLevel) {
            this.escalateToDirector(call)
        } else {
            this.resolveCall(call)
        }
    }

    escalateToDirector(call: Call) {
        //CallCenter.dispatchToDirector()
        call.addLog(
            `escalted to director by ${this.responsibilityLevel} ${this.employeeId}`
        )
        this.callCenter.dispatchToDirector(call)
        this.markAvailable()
    }
}

export class Director extends BaseEmployee {
    constructor(id: number, callCenter: CallCenter) {
        super(id, ResponsibilityLevel.Director, callCenter)
    }

    intakeCall(call: Call) {
        /*
            remove self from CallCenter's apropriate available que
            resolve
        */
        this.markUnavailable()
        this.resolveCall(call)
    }
}

export class RespondentCreator {
    private idCounter = 1

    constructor(private callCenter: CallCenter) {}

    create() {
        return new Respondent(this.idCounter++, this.callCenter)
    }
}

export class ManagerCreator {
    private idCounter = 1

    constructor(private callCenter: CallCenter) {}

    create() {
        return new Manager(this.idCounter++, this.callCenter)
    }
}

export class DirectorCreator {
    private idCounter = 1

    constructor(private callCenter: CallCenter) {}

    create() {
        return new Director(this.idCounter++, this.callCenter)
    }
}
