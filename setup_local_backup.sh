#!/bin/bash
# ==============================================================================
# Local Automated Backup for Supabase (Coolify)
# ==============================================================================

# Ensure script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "الرجاء تشغيل السكربت بصلاحيات الرووت (Root)!"
  exit
fi

echo "🚀 بدء إعداد النسخ الاحتياطي المحلي..."

BACKUP_DIR="/opt/supabase_backups"
mkdir -p "$BACKUP_DIR"

# إنشاء سكربت النسخ الاحتياطي الفعلي
cat << 'EOF' > "$BACKUP_DIR/backup.sh"
#!/bin/bash
BACKUP_DIR="/opt/supabase_backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
# البحث عن اسم حاوية قاعدة بيانات Supabase
CONTAINER_NAME=$(docker ps --format '{{.Names}}' | grep "supabase-db" | head -n 1)

if [ -z "$CONTAINER_NAME" ]; then
    echo "$(date) - Error: Supabase DB container not found!"
    exit 1
fi

echo "$(date) - Starting backup for container: $CONTAINER_NAME"
docker exec "$CONTAINER_NAME" pg_dumpall -U postgres > "$BACKUP_DIR/supabase_backup_$TIMESTAMP.sql"

# ضغط النسخة لتوفير مساحة في السيرفر
gzip "$BACKUP_DIR/supabase_backup_$TIMESTAMP.sql"

# حذف النسخ الأقدم من 7 أيام تلقائياً (لكي لا يمتلئ السيرفر)
find "$BACKUP_DIR" -type f -name "supabase_backup_*.sql.gz" -mtime +7 -delete

echo "$(date) - Backup completed successfully: supabase_backup_$TIMESTAMP.sql.gz"
EOF

# إعطاء صلاحية التشغيل لسكربت النسخ
chmod +x "$BACKUP_DIR/backup.sh"

# إعداد المؤقت (Cron Job) ليعمل يومياً الساعة 12 منتصف الليل
echo "⏰ جاري جدولة النسخ الاحتياطي ليعمل يومياً..."
(crontab -l 2>/dev/null | grep -v "$BACKUP_DIR/backup.sh"; echo "0 0 * * * $BACKUP_DIR/backup.sh >> $BACKUP_DIR/backup.log 2>&1") | crontab -

echo "=============================================================================="
echo "✅ تم إعداد النسخ الاحتياطي المحلي بنجاح!"
echo "سيتم حفظ نسخة مضغوطة من قاعدة البيانات يومياً في المسار: $BACKUP_DIR"
echo "يتم الاحتفاظ بنسخ آخر 7 أيام فقط ويتم حذف الأقدم تلقائياً لتوفير المساحة."
echo "=============================================================================="
