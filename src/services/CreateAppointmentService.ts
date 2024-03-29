import { startOfHour } from "date-fns"
import { getCustomRepository } from 'typeorm'

import AppError from '../errors/AppError'

import Appointment from "../models/Appointment"
import AppointmentRepository from "../repositories/AppointmentRepository"

interface Request {
  provider_id: string
  date: Date
}

class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentRepository)

    const appointmentDate = startOfHour(date)

    const findAppointmentInSameData = await appointmentsRepository.findByDate(appointmentDate)

    if (findAppointmentInSameData) {
      throw new AppError('This appointment is already booked')
    }

    const appointment = appointmentsRepository.create({ 
      provider_id, 
      date: appointmentDate})

    await appointmentsRepository.save(appointment)

    return appointment
    }
}

export default CreateAppointmentService