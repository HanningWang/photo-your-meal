Page({
  data: {
    selectedDate: '',
    formattedDate: ''
  },

  onLoad() {
    // Set the initial date to today
    const today = new Date();
    const formattedToday = this.formatDate(today);
    this.setData({
      selectedDate: formattedToday,
      formattedDate: this.formatDateForDisplay(today)
    });
  },

  onDateChange(e: any) {
    const selectedDate = new Date(e.detail.value);
    this.setData({
      selectedDate: e.detail.value,
      formattedDate: this.formatDateForDisplay(selectedDate)
    });
    // Here you can add logic to fetch and display records for the selected date
  },

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  formatDateForDisplay(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  }
})
