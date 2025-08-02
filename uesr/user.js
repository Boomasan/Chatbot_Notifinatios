// user.js - ระบบ User สำหรับรับการแจ้งเตือน

let notifications = [];
let currentFilter = 'all';

const typeIcons = {
    'news': '📰',
    'event': '🎉',
    'announcement': '📢',
    'promotion': '🏷️',
    'recruitment': '👥',
    'education': '📚'
};

const typeNames = {
    'news': 'ข่าวสาร',
    'event': 'กิจกรรม',
    'announcement': 'ประกาศ',
    'promotion': 'โปรโมชั่น',
    'recruitment': 'รับสมัครงาน',
    'education': 'การศึกษา'
};

// โหลดการแจ้งเตือนจาก localStorage
function loadNotifications() {
    notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    displayNotifications();
    updateUnreadCount();
}

// แสดงการแจ้งเตือน
function displayNotifications() {
    const container = document.getElementById('notificationsContainer');
    
    // กรองตามเงื่อนไข
    let filteredNotifications = notifications.filter(notification => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'read') return notification.isRead;
        if (currentFilter === 'unread') return !notification.isRead;
        return notification.type === currentFilter;
    });

    if (filteredNotifications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 3em; margin-bottom: 15px;">📭</div>
                <h3>ไม่พบการแจ้งเตือน</h3>
                <p>ไม่มีการแจ้งเตือนที่ตรงกับเงื่อนไขที่เลือก</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredNotifications.map(notification => `
        <div class="notification-item ${notification.isRead ? 'read' : 'unread'}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div class="notification-type type-${notification.type}">
                    ${typeIcons[notification.type]} ${typeNames[notification.type]}
                </div>
                <div class="status-indicator ${notification.isRead ? 'status-read' : 'status-unread'}"></div>
            </div>
            
            <div class="notification-title">${notification.title}</div>
            <div class="notification-content">${notification.content}</div>
            
            <div class="notification-footer">
                <div class="notification-time">⏰ ${formatDate(notification.time)}</div>
                <div class="notification-actions">
                    ${!notification.isRead ? 
                        `<button class="action-btn-small read" onclick="markAsRead(${notification.id})">อ่านแล้ว</button>` : 
                        `<button class="action-btn-small" onclick="markAsUnread(${notification.id})">ยังไม่อ่าน</button>`
                    }
                    <button class="action-btn-small delete" onclick="deleteNotification(${notification.id})">ลบ</button>
                </div>
            </div>
        </div>
    `).join('');
}

// จัดรูปแบบวันที่
function formatDate(dateString) {
    const date = new Date(dateString.replace(' ', 'T'));
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'เมื่อสักครู่';
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`;

    return date.toLocaleDateString('th-TH');
}

// ทำเครื่องหมายอ่านแล้ว
function markAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.isRead = true;
        saveNotifications();
        displayNotifications();
        updateUnreadCount();
    }
}

// ทำเครื่องหมายยังไม่อ่าน
function markAsUnread(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.isRead = false;
        saveNotifications();
        displayNotifications();
        updateUnreadCount();
    }
}

// อ่านทั้งหมด
function markAllAsRead() {
    notifications.forEach(n => n.isRead = true);
    saveNotifications();
    displayNotifications();
    updateUnreadCount();
}

// ลบการแจ้งเตือน
function deleteNotification(id) {
    if (confirm('คุณต้องการลบการแจ้งเตือนนี้หรือไม่?')) {
        notifications = notifications.filter(n => n.id !== id);
        saveNotifications();
        displayNotifications();
        updateUnreadCount();
    }
}

// บันทึกการแจ้งเตือนลง localStorage
function saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// อัพเดทจำนวนการแจ้งเตือนที่ยังไม่อ่าน
function updateUnreadCount() {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    document.getElementById('unreadCount').textContent = unreadCount;
    
    // อัพเดท title ของหน้าเว็บ
    document.title = unreadCount > 0 ? 
        `(${unreadCount}) User - การแจ้งเตือน` : 
        'User - การแจ้งเตือน';
}

// แสดงแจ้งเตือนใหม่
function showNewNotificationAlert() {
    const alert = document.getElementById('newNotificationAlert');
    alert.classList.add('show');
    
    setTimeout(() => {
        alert.classList.remove('show');
    }, 3000);
}

// ตรวจสอบการแจ้งเตือนใหม่
function checkForNewNotifications() {
    const lastCheck = localStorage.getItem('lastNotificationCheck') || '0';
    const newNotificationTime = localStorage.getItem('newNotification') || '0';
    
    if (newNotificationTime > lastCheck) {
        // มีการแจ้งเตือนใหม่
        loadNotifications();
        showNewNotificationAlert();
        localStorage.setItem('lastNotificationCheck', Date.now().toString());
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // โหลดการแจ้งเตือนเมื่อเริ่มต้น
    loadNotifications();
    
    // ตั้งค่า filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            displayNotifications();
        });
    });
    
    // ตรวจสอบการแจ้งเตือนใหม่ทุก 2 วินาที
    setInterval(checkForNewNotifications, 2000);
    
    // ตรวจสอบเมื่อ localStorage เปลี่ยนแปลง (เมื่อมี tab อื่นเปิดอยู่)
    window.addEventListener('storage', function(e) {
        if (e.key === 'newNotification') {
            checkForNewNotifications();
        }
    });
});

// เพิ่มฟังก์ชันสำหรับ Admin เพื่อทดสอบ (ลบออกในการใช้งานจริง)
function addTestNotification() {
    const testTypes = ['news', 'event', 'announcement', 'promotion'];
    const testNotification = {
        id: Date.now(),
        type: testTypes[Math.floor(Math.random() * testTypes.length)],
        title: 'การแจ้งเตือนทดสอบ #' + Math.floor(Math.random() * 1000),
        content: 'นี่คือการแจ้งเตือนทดสอบจากระบบ Admin เพื่อทดสอบการทำงาน',
        time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        isRead: false,
        sentBy: 'admin',
        sentAt: new Date().toISOString()
    };
    
    notifications.unshift(testNotification);
    saveNotifications();
    localStorage.setItem('newNotification', Date.now().toString());
    displayNotifications();
    updateUnreadCount();
}