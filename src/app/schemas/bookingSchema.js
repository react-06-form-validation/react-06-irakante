import { z } from 'zod';

/**
 * Builds the Zod schema for the booking form.
 *
 * TODO: implement the validation rules described in README.md → "Form Fields & Validation Rules":
 *  - bookerName: string, required, min 2 characters
 *  - bookerEmail: string, optional, must be a valid email when provided (empty string is allowed)
 *  - eventName: string, required, min 2 characters
 *  - eventDate: required, must be a future date
 *  - numberOfGuests: number, required, integer, min 1, max 10
 *  - timeSlot: string, required, must be one of `availableTimeSlots`
 *  - eventLink: string, required, must be a valid URL
 *
 * @param {string[]} availableTimeSlots - time slots fetched from `/api/time-slots`
 */
export const createBookingSchema = (availableTimeSlots = []) =>
  z.object({
    bookerName: z
      .string({ required_error: "Booker name is required" })
      .min(2, "Name must be at least 2 characters"),

    bookerEmail: z
      .email("Invalid email format")
      .optional()
      .or(z.literal('')),

    eventName: z
      .string({ required_error: "Event name is required" })
      .min(2, "Event name must be at least 2 characters"),

    eventDate: z
      .date({ required_error: "Event date is required" })
      .refine((date) => date > new Date(), {
        message: "Event date must be in the future",
      }),

    numberOfGuests: z
      .coerce
      .number({ required_error: "Number of guests is required" })
      .int("Guests must be an integer")
      .min(1, "Minimum 1 guest required")
      .max(10, "Maximum 10 guests allowed"),

    timeSlot: z
      .string({ required_error: "Time slot is required" })
      .refine((slot) => availableTimeSlots.includes(slot), {
        message: "Selected time slot is invalid or unavailable",
      }),

    eventLink: z
      .url("Invalid URL format")
  });
