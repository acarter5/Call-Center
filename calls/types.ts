import { ResponsibilityLevel } from '../employees/types'

export enum Status {
    Resolved = 'resolved',
    Unresolved = 'unresolved',
}

// export interface Call {
//     id: number
//     severity: null | ResponsibilityLevel
//     status: Status
//     logs: string[]
//     addLog: (message: string) => void
//     changeStatus: (status: Status) => void
//     changeSeverity: (severity: ResponsibilityLevel) => void
// }
