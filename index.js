// ตัวแปรเก็บข้อมูล
        let notifications = [];
        let notificationId = 1;

        // ฟังก์ชันสร้างการแจ้งเตือน
        function createNotification(type, title, message, urgent = false) {
            const notification = {
                id: notificationId++,
                type: type,
                title: title,
                message: message,
                urgent: urgent,
                timestamp: new Date(),
                read: false
            };
            
            notifications.unshift(notification);
            renderNotifications();
            updateStats();
            
            // เสียงแจ้งเตือน (จำลอง)
            console.log(`🔔 แจ้งเตือนใหม่: ${title}`);
            
            return notification;
        }

        // ฟังก์ชันแสดงการแจ้งเตือน
        function renderNotifications() {
            const listElement = document.getElementById('notificationsList');
            
            if (notifications.length === 0) {
                listElement.innerHTML = `
                    <div style="text-align: center; padding: 50px; color: #6c757d;">
                        📱 ยังไม่มีการแจ้งเตือน<br>
                        <small>กดปุ่มด้านซ้ายเพื่อส่งการแจ้งเตือนทดสอบ</small>
                    </div>
                `;
                return;
            }

            listElement.innerHTML = notifications.map(notification => `
                <div class="notification ${notification.urgent ? 'urgent' : notification.type}" 
                     onclick="markAsRead(${notification.id})">
                    <div class="notification-type type-${notification.type}">
                        ${getTypeIcon(notification.type)} ${getTypeText(notification.type)}
                    </div>
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <div class="timestamp">
                        ⏰ ${formatThaiDateTime(notification.timestamp)}
                        ${!notification.read ? ' • <strong style="color: #ff4757;">ยังไม่ได้อ่าน</strong>' : ''}
                    </div>
                </div>
            `).join('');
        }

        // ฟังก์ชันอัพเดทสถิติ
        function updateStats() {
            document.getElementById('totalNotifications').textContent = notifications.length;
            document.getElementById('unreadCount').textContent = notifications.filter(n => !n.read).length;
            document.getElementById('notificationBadge').textContent = notifications.filter(n => !n.read).length;
        }

        // ฟังก์ชันทำเครื่องหมายว่าอ่านแล้ว
        function markAsRead(id) {
            const notification = notifications.find(n => n.id === id);
            if (notification) {
                notification.read = true;
                renderNotifications();
                updateStats();
            }
        }

        // ฟังก์ชันช่วยเหลือ
        function getTypeIcon(type) {
            const icons = {
                urgent: '🚨',
                maintenance: '🔧',
                payment: '💰',
                general: '📢'
            };
            return icons[type] || '📢';
        }

        function getTypeText(type) {
            const texts = {
                urgent: 'ด่วน',
                maintenance: 'บำรุงรักษา',
                payment: 'ชำระเงิน',
                general: 'ทั่วไป'
            };
            return texts[type] || 'ทั่วไป';
        }

        function formatThaiDateTime(date) {
            return date.toLocaleString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // ฟังก์ชันส่งการแจ้งเตือนแต่ละประเภท
        function sendUrgentNotification() {
            const messages = [
                'ระบบไฟฟ้าขัดข้อง ชั้น 15-20 กรุณาใช้บันไดหนีไฟ',
                'พบผู้ต้องสงสัยในอาคาร กรุณาติดต่อรปภ. ทันที',
                'ระบบน้ำประปาขัดข้อง จะได้รับการแก้ไขภายใน 2 ชั่วโมง'
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            createNotification('urgent', '⚠️ แจ้งเตือนเร่งด่วน', randomMessage, true);
        }

        function sendMaintenanceNotification() {
            const messages = [
                'บำรุงรักษาลิฟต์ A,B วันเสาร์ที่ 10 ส.ค. เวลา 09:00-17:00',
                'ทำความสะอาดถังน้ำใส วันอาทิตย์ที่ 11 ส.ค. เวลา 06:00-10:00',
                'ตรวจสอบระบบดับเพลิง วันจันทร์ที่ 12 ส.ค. เวลา 14:00-16:00'
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            createNotification('maintenance', '🔧 แจ้งบำรุงรักษา', randomMessage);
        }

        function sendPaymentNotification() {
            const messages = [
                'ค่าส่วนกลางประจำเดือน ส.ค. 2568 ครบกำหนดชำระวันที่ 5 ส.ค.',
                'ค่าน้ำประปาประจำเดือน ก.ค. 2568 จำนวน 450 บาท',
                'ค่าไฟฟ้าประจำเดือน ก.ค. 2568 จำนวน 1,250 บาท'
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            createNotification('payment', '💰 แจ้งชำระเงิน', randomMessage);
        }

        function sendGeneralNotification() {
            const messages = [
                'กิจกรรมงานวันเด็ก วันเสาร์ที่ 10 ส.ค. ลานกิจกรรมชั้น G',
                'ขอความร่วมมือปิดประตูลิฟต์เบาๆ เพื่อยืดอายุการใช้งาน',
                'เปิดรับสมัครคณะกรรมการอาคารชุด สนใจติดต่อฝ่ายจัดการ'
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            createNotification('general', '📢 ประกาศทั่วไป', randomMessage);
        }

        // เริ่มต้นระบบ
        window.onload = function() {
            // สร้างการแจ้งเตือนตัวอย่าง
            createNotification('general', '👋 ยินดีต้อนรับ', 'ระบบแจ้งเตือน The 1 Condo พร้อมใช้งานแล้ว');
            
            // จำลองการแจ้งเตือนอัตโนมัติ
            setInterval(() => {
                if (Math.random() < 0.3) { // 30% โอกาสในการส่งแจ้งเตือนทุกๆ 10 วินาที
                    const types = ['general', 'maintenance', 'payment'];
                    const randomType = types[Math.floor(Math.random() * types.length)];
                    
                    if (randomType === 'general') sendGeneralNotification();
                    else if (randomType === 'maintenance') sendMaintenanceNotification();
                    else sendPaymentNotification();
                }
            }, 10000);
        };