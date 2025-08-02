import dayjs from "dayjs";

export const formatDateForDisplay = (date: Date) => {
  return dayjs(date).format('MMM D, YYYY');
};