import { WorkerAttributes } from '../task-router/Worker';

export interface Worker {
  activity_name: string;
  attributes: WorkerAttributes;
  date_activity_changed?: string;
  date_updated: string;
  friendly_name: string;
  worker_activity_sid: string;
  worker_sid: string;
  workspace_sid: string;
}

export interface Reservation {
  attributes: object;
  date_created: string;
  date_updated: string;
  queue_name: string;
  reservation_sid: string;
  status: 'pending'|'accepted'|'rejected'|'timeout'|'canceled'|'rescinded'|'wrapping'|'completed';
  task_age: number;
  task_channel_unique_name: string;
  task_date_created: string;
  task_priority: number;
  task_sid: string;
  task_status: 'reserved'|'assigned'|'canceled'|'wrapping'|'completed'|'transferring';
  worker_name: string;
  worker_sid: string;
  workspace_sid: string;
}