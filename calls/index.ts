import { Status } from './types'
import { ResponsibilityLevel } from '../employees/types'

export class Call {
    public severity: ResponsibilityLevel | null = null
    public status: Status = Status.Unresolved
    public logs: string[] = []
    constructor(public callId: number) {}

    addLog(message: string): void {
        this.logs.push(message)
    }

    changeStatus(status: Status): void {
        this.status = status
    }

    changeSeverity(severity: ResponsibilityLevel): void {
        this.severity = severity
    }
}

export class CallCreator {
    private idCounter = 1

    create() {
        return new Call(this.idCounter++)
    }
}
