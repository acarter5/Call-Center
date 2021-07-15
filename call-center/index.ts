import {
    Respondent,
    Manager,
    Director,
    RespondentCreator,
    ManagerCreator,
    DirectorCreator,
} from '../employees/index'
import { Call } from '../calls/index'
import { Queue } from '../data-structures/index'
import { ResponsibilityLevel } from '../employees/types'

export class CallCenter {
    public availableRespondents: Queue<Respondent> = new Queue()
    public availableManagers: Queue<Manager> = new Queue()
    public availableDirectors: Queue<Director> = new Queue()
    public resolvedCalls: Call[] = []
    protected unansweredCalls: Queue<Call> = new Queue()
    protected unansweredSevereCalls: Queue<Call> = new Queue()

    constructor() {
        //populate employees
        const respondentCreator: RespondentCreator = new RespondentCreator(this)
        const managerCreator: ManagerCreator = new ManagerCreator(this)
        const directorCreator: DirectorCreator = new DirectorCreator(this)
        for (let i = 1; i <= 5; i++) {
            this.availableRespondents.enqueue(respondentCreator.create())
            this.availableManagers.enqueue(managerCreator.create())
            this.availableDirectors.enqueue(directorCreator.create())
        }
    }

    dispatchIncommingCall(call: Call) {
        if (
            call.severity === ResponsibilityLevel.Respondent ||
            call.severity === null
        ) {
            this.dispatchToRespondent(call)
        } else if (call.severity === ResponsibilityLevel.Manager) {
            this.dispatchToManager(call)
        } else {
            this.dispatchToDirector(call)
        }
    }

    dispatchToRespondent(call: Call) {
        this.unansweredCalls.enqueue(call)
        this.checkUnansweredCallsQue()
    }

    dispatchToManager(call: Call) {
        if (this.availableManagers.isEmpty()) {
            this.dispatchToDirector(call)
        } else {
            const manager = this.availableManagers.dequeue()
            if (typeof manager !== 'string') {
                manager.intakeCall(call)
            }
        }
    }

    dispatchToDirector(call: Call) {
        this.unansweredSevereCalls.enqueue(call)
        this.checkUnansweredSevereCallsQue()
    }

    checkUnansweredCallsQue() {
        if (
            !this.availableRespondents.isEmpty() &&
            !this.unansweredCalls.isEmpty()
        ) {
            const respondent = this.availableRespondents.dequeue()
            const call = this.unansweredCalls.dequeue()
            if (typeof respondent !== 'string' && typeof call !== 'string') {
                respondent.intakeCall(call)
            }
        }
    }

    checkUnansweredSevereCallsQue() {
        if (
            !this.availableDirectors.isEmpty() &&
            !this.unansweredSevereCalls.isEmpty()
        ) {
            const director = this.availableDirectors.dequeue()
            const call = this.unansweredSevereCalls.dequeue()
            if (typeof director !== 'string' && typeof call !== 'string') {
                director.intakeCall(call)
            }
        }
    }
}
