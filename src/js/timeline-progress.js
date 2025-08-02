// Timeline Progress Calculator for Full Stack Developer Journey
// Period: May 12, 2025 - May 12, 2030 (5 years including leap year = 1826 days)

class TimelineProgress {
    constructor() {
        this.startDate = new Date('2025-05-12T00:00:00');
        this.endDate = new Date('2030-05-12T00:00:00');
        this.totalDays = 1826; // 5 years including one leap year (2028)
        
        this.progressFill = document.getElementById('progressFill');
        this.progressPercentage = document.getElementById('progressPercentage');
        this.currentDateElement = document.getElementById('currentDate');
        
        // Initialize the progress
        this.updateProgress();
        
        // Update progress every second for smooth animation
        setInterval(() => {
            this.updateProgress();
        }, 1000);
    }
    
    // Calculate the progress percentage based on elapsed days
    calculateProgress() {
        const now = new Date();
        const elapsedMs = now - this.startDate;
        const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
        
        // Calculate percentage with decimal precision for smooth animation
        let percentage = (elapsedDays / this.totalDays) * 100;
        
        // Cap at 100% when the journey is complete
        if (percentage > 100) {
            percentage = 100;
        }
        
        // Ensure non-negative percentage
        if (percentage < 0) {
            percentage = 0;
        }
        
        return percentage;
    }
    
    // Format date to French locale (DD/MM/YYYY)
    formatDate(date) {
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // Update the progress bar and display information
    updateProgress() {
        const percentage = this.calculateProgress();
        const formattedPercentage = percentage.toFixed(2);
        
        // Update the fill width with smooth transition
        if (this.progressFill) {
            this.progressFill.style.width = `${percentage}%`;
        }
        
        // Update percentage display
        if (this.progressPercentage) {
            this.progressPercentage.textContent = `${formattedPercentage}%`;
        }
        
        // Update current date display
        if (this.currentDateElement) {
            const now = new Date();
            this.currentDateElement.textContent = `Date actuelle: ${this.formatDate(now)}`;
        }
    }
}

// Initialize the timeline progress when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if the progress elements exist before initializing
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        window.timelineProgress = new TimelineProgress();
    }
});