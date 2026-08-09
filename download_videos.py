#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
أداة تحميل الفيديوهات (Al-Mikhlafi Video Downloader CLI)
أداة قوية وخفيفة بلغة بايثون مزودة بواجهة سطر أوامر توضيحية (Rich CLI)
لتحميل جميع الفيديوهات من ملف JSON بأفضل جودة وترتيبها حسب العنوان.
"""

import os
import sys
import subprocess
import json
import re
import argparse
from pathlib import Path

VENV_DIR = Path(__file__).parent / ".venv_downloader"

def ensure_dependencies():
    """التحقق التلقائي من وجود المتطلبات وتثبيتها في بيئة افتراضية معزولة عند الحاجة"""
    try:
        import yt_dlp
        import rich
        return
    except ImportError:
        pass

    if os.environ.get("VENV_BOOTSTRAPPED") == "1":
        print("❌ خطأ حرج: تعذر استيراد المكتبات حتى بعد التثبيت التلقائي.")
        sys.exit(1)

    print("⚠️  المكتبات المطلوبة (yt-dlp, rich) غير مثبتة في البيئة الحالية.")
    print("⏳ جاري إنشاء بيئة افتراضية خفيفة وتثبيت المكتبات تلقائياً (لمرة واحدة فقط)...")
    
    if not VENV_DIR.exists():
        subprocess.run([sys.executable, "-m", "venv", str(VENV_DIR)], check=True)
        
    pip_exe = VENV_DIR / "bin" / "pip"
    python_exe = VENV_DIR / "bin" / "python"
    
    subprocess.run([str(pip_exe), "install", "--quiet", "--upgrade", "yt-dlp", "rich"], check=True)
    
    print("✅ تم التثبيت بنجاح! إعادة تشغيل الأداة في البيئة المخصصة...\n")
    os.environ["VENV_BOOTSTRAPPED"] = "1"
    os.execv(str(python_exe), [str(python_exe), __file__] + sys.argv[1:])

ensure_dependencies()

# استيراد المكتبات بعد التأكد من وجودها
import yt_dlp
from rich.console import Console
from rich.table import Table
from rich.progress import Progress, BarColumn, TextColumn, DownloadColumn, TransferSpeedColumn, TimeRemainingColumn
from rich.panel import Panel
from rich.style import Style
from rich import print as rprint

console = Console()

class YTDLPLogger:
    """كائن تفادي الطباعة الافتراضية المزعجة لـ yt-dlp في الموجه"""
    def debug(self, msg):
        pass
    def warning(self, msg):
        pass
    def error(self, msg):
        pass

def sanitize_filename(title: str) -> str:
    """تنظيف نص العنوان ليكون اسماً صالحاً لملف في نظام التشغيل"""
    # إزالة الرموز غير المسموح بها في أسماء الملفات
    clean = re.sub(r'[\\/*?:"<>|]', "", title)
    clean = re.sub(r'\s+', " ", clean).strip()
    return clean

def load_and_sort_videos(json_path: Path):
    """قراءة ملف الـ JSON وترتيب الفيديوهات أبجدياً حسب العنوان"""
    if not json_path.exists():
        rprint(f"[bold red]❌ خطأ: ملف الفيديوهات '{json_path}' غير موجود![/bold red]")
        sys.exit(1)
        
    with open(json_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            rprint(f"[bold red]❌ خطأ في تنسيق ملف JSON:[/bold red] {e}")
            sys.exit(1)
            
    if not isinstance(data, list):
        rprint("[bold red]❌ بنية الملف غير صحيحة: يجب أن يكون الملف مصفوفة من الفيديوهات (JSON Array)[/bold red]")
        sys.exit(1)

    # الترتيب أبجدياً حسب حقل title
    sorted_videos = sorted(data, key=lambda x: x.get("title", "").strip())
    return sorted_videos

def display_videos_table(videos: list, limit: int = None, output_dir: Path = None):
    """عرض جدول توضيحي بالفيديوهات وأسماء الملفات التي سيتم حفظها"""
    table = Table(
        title="📋 أرشيف فيديوهات الأستاذ عبدالملك المخلافي (مرتبة حسب العنوان)",
        show_lines=True,
        header_style="bold cyan",
        border_style="dim blue"
    )
    table.add_column("التسلسل", justify="center", style="bold yellow", width=8)
    table.add_column("عنوان الفيديو (Title)", style="white", ratio=4)
    table.add_column("الرابط (URL)", style="dim blue", ratio=2)
    table.add_column("اسم الملف المستهدف (Target Filename)", style="green", ratio=3)

    count = len(videos) if limit is None else min(limit, len(videos))
    for idx in range(count):
        v = videos[idx]
        title = v.get("title", "").strip()
        url = v.get("url", "").strip()
        filename = f"{idx+1:02d} - {sanitize_filename(title)}.mp4"
        table.add_row(f"#{idx+1:02d}", title, url, filename)

    console.print(table)
    console.print(f"[bold green]✔ إجمالي عدد الفيديوهات المحددة:[/bold green] [bold cyan]{count}[/bold cyan]")
    if output_dir:
        console.print(f"[bold green]✔ مجلد الحفظ:[/bold green] [bold yellow]{output_dir.resolve()}[/bold yellow]\n")

def download_videos(videos: list, output_dir: Path, limit: int = None, archive_file: Path = None):
    """المحرك الرئيسي لتحميل الفيديوهات مع شريط تقدم تفاعلي"""
    output_dir.mkdir(parents=True, exist_ok=True)
    count = len(videos) if limit is None else min(limit, len(videos))

    successful = 0
    skipped = 0
    failed = 0

    console.print(Panel("[bold white]🚀 بدء عملية التحميل بأفضل جودة متميزة...[/bold white]", style="bold blue"))

    for idx in range(count):
        video_data = videos[idx]
        title = video_data.get("title", "").strip()
        url = video_data.get("url", "").strip()
        clean_title = sanitize_filename(title)
        prefix = f"{idx+1:02d} - "
        expected_basename = f"{prefix}{clean_title}"

        console.print(f"\n[bold cyan]------------------------------------------------------------[/bold cyan]")
        console.print(f"[bold yellow]🎬 الفيديو [{idx+1}/{count}]:[/bold yellow] [bold white]{title}[/bold white]")
        console.print(f"[dim]🔗 الرابط: {url}[/dim]")

        # قالب اسم الملف لـ yt-dlp
        outtmpl = str(output_dir / f"{expected_basename}.%(ext)s")

        # التحقق من وجود ffmpeg لضمان عدم فشل التحميل
        import shutil
        has_ffmpeg = shutil.which("ffmpeg") is not None
        if not has_ffmpeg and idx == 0:
            console.print("[dim yellow]💡 تنبيه: أداة ffmpeg غير مثبتة في النظام، يتم التحميل بأفضل جودة مدمجة متاحة مباشرة (Best Single File).[/dim yellow]")

        # إعداد شريط التقدم للفيديو الحالي
        with Progress(
            TextColumn("[bold green]{task.description}"),
            BarColumn(bar_width=35),
            "[progress.percentage]{task.percentage:>3.1f}%",
            "•",
            DownloadColumn(),
            "•",
            TransferSpeedColumn(),
            "•",
            TimeRemainingColumn(),
            console=console
        ) as progress:
            task_id = progress.add_task("⬇️ جاري التحميل", total=None)

            def yt_hook(d):
                status = d.get('status')
                if status == 'downloading':
                    total_bytes = d.get('total_bytes') or d.get('total_bytes_estimate')
                    downloaded = d.get('downloaded_bytes', 0)
                    if total_bytes:
                        progress.update(task_id, total=total_bytes, completed=downloaded)
                    else:
                        progress.update(task_id, completed=downloaded)
                elif status == 'finished':
                    total_bytes = d.get('total_bytes') or d.get('total_bytes_estimate', 0)
                    if total_bytes:
                        progress.update(task_id, total=total_bytes, completed=total_bytes)
                    progress.update(task_id, description="[bold green]✔ تم اكتمال التنزيل")

            ydl_opts = {
                'format': 'bestvideo+bestaudio/best' if has_ffmpeg else 'best[ext=mp4]/best',
                'outtmpl': outtmpl,
                'quiet': True,
                'no_warnings': True,
                'logger': YTDLPLogger(),
                'progress_hooks': [yt_hook],
                'retries': 3,
                'fragment_retries': 3,
                'nocheckcertificate': True,
            }
            if has_ffmpeg:
                ydl_opts['merge_output_format'] = 'mp4'
            if archive_file:
                ydl_opts['download_archive'] = str(archive_file)

            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(url, download=True)
                    successful += 1
            except yt_dlp.utils.DownloadError as e:
                err_str = str(e)
                if "has already been recorded in the archive" in err_str:
                    console.print("[bold yellow]⏩ تم تخطّي الفيديو (تم تحميله مسبقاً في السجل)[/bold yellow]")
                    skipped += 1
                else:
                    console.print(f"[bold red]❌ فشل التحميل:[/bold red] {err_str}")
                    failed += 1
            except Exception as e:
                console.print(f"[bold red]❌ خطأ غير متوقع:[/bold red] {e}")
                failed += 1

    # ملخص النتائج الختامية
    console.print("\n")
    summary_text = (
        f"[bold green]✔ تم التحميل بنجاح:[/bold green] {successful}\n"
        f"[bold yellow]⏩ تم التخطي (موجود مسبقاً):[/bold yellow] {skipped}\n"
        f"[bold red]❌ حدث خطأ أثناء التحميل:[/bold red] {failed}\n"
        f"[bold cyan]📊 الإجمالي معالج:[/bold cyan] {successful + skipped + failed} من أصل {count}"
    )
    console.print(Panel(summary_text, title="🎯 ملخص نتائج عملية التحميل", border_style="bold green" if failed == 0 else "bold yellow"))

def main():
    parser = argparse.ArgumentParser(
        description="أداة تحميل فيديوهات الأستاذ عبدالملك المخلافي مرتبة حسب العنوان بأفضل جودة",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    default_json = Path(__file__).parent / "al_mikhlafi_all_videos.json"
    default_output = Path(__file__).parent / "al_mikhlafi_videos"

    parser.add_argument("-i", "--input", type=Path, default=default_json, help="مسار ملف JSON المحتوي على الروابط والعناوين")
    parser.add_argument("-o", "--output", type=Path, default=default_output, help="مجلد حفظ الفيديوهات المحملة")
    parser.add_argument("--limit", type=int, default=None, help="تحميل عدد معين فقط من الفيديوهات (مفيد للاختبار)")
    parser.add_argument("--dry-run", action="store_true", help="عرض جدول الفيديوهات التي سيتم تحميلها وترتيبها دون البدء بالتحميل")
    parser.add_argument("--archive", type=Path, default=None, help="ملف أرشيف لتسجيل الفيديوهات المحملة وتجنب إعادة تحميلها")

    args = parser.parse_args()

    videos = load_and_sort_videos(args.input)

    display_videos_table(videos, limit=args.limit, output_dir=args.output)

    if args.dry_run:
        console.print("[bold yellow]💡 وضع التجربة (--dry-run) مفعّل: لم يتم بدء التحميل الفعلي.[/bold yellow]")
        sys.exit(0)

    download_videos(videos, args.output, limit=args.limit, archive_file=args.archive)

if __name__ == "__main__":
    main()
