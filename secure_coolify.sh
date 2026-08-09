#!/bin/bash
# ==============================================================================
# Coolify Server Security Hardening Script
# ==============================================================================

# Ensure script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "الرجاء تشغيل السكربت بصلاحيات الرووت (Root)!"
  exit
fi

echo "🚀 بدء عملية تأمين السيرفر..."

# 1. تحديث النظام (System Updates)
echo "🔄 جاري تحديث الحزم والنظام الأساسي..."
apt-get update -y
apt-get upgrade -y
DEBIAN_FRONTEND=noninteractive apt-get install -y unattended-upgrades fail2ban ufw curl

# 2. إعداد التحديثات التلقائية (Unattended Upgrades)
echo "🛡️ تفعيل التحديثات الأمنية التلقائية..."
dpkg-reconfigure -f noninteractive unattended-upgrades

# 3. إعداد الذاكرة الوهمية (Swap Memory)
if ! grep -q "swapfile" /etc/fstab; then
    echo "💾 إنشاء ذاكرة Swap بحجم 2GB..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "vm.swappiness=10" >> /etc/sysctl.conf
    sysctl -p
else
    echo "✅ الذاكرة الوهمية (Swap) موجودة بالفعل."
fi

# 4. إعداد جدار الحماية (UFW)
echo "🧱 إعداد جدار الحماية..."
ufw default deny incoming
ufw default allow outgoing

# السماح بالمنافذ الأساسية للجميع (وسيتم حمايتها تلقائياً بواسطة Fail2Ban)
ufw allow 22/tcp       # SSH
ufw allow 80/tcp       # HTTP
ufw allow 443/tcp      # HTTPS
ufw allow 8000/tcp     # لوحة تحكم Coolify (لبعض الإصدارات)
ufw allow 6001/tcp     # Coolify Realtime (Websockets)

# تفعيل الجدار بشكل صامت بدون الحاجة لتأكيد
ufw --force enable

# 5. إعداد Fail2Ban للحماية من محاولات الدخول العشوائية
echo "🚫 إعداد وتفعيل خدمة Fail2Ban..."
cat <<EOF > /etc/fail2ban/jail.local
[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
findtime = 600
EOF

systemctl restart fail2ban
systemctl enable fail2ban

echo "=============================================================================="
echo "✅ تم الانتهاء بنجاح من تأمين السيرفر!"
echo "ملاحظة: لم أقم بإلغاء تسجيل الدخول بكلمة المرور (Password) لضمان عدم فقدانك الوصول للسيرفر."
echo "إذا قمت بربط مفتاح SSH بنجاح من جهازك المحلي مستقبلاً، يمكنك إيقاف كلمات المرور يدوياً."
echo "=============================================================================="
