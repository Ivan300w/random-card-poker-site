from pathlib import Path
from shutil import copyfile
from xml.sax.saxutils import escape

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "random-card-poker-resumen-ejecutivo.pdf"
PUBLIC_OUTPUT = ROOT / "assets" / "random-card-poker-one-page-overview.pdf"
HERO_IMAGE = ROOT / "assets" / "rcp-hero-operator-review.webp"
HERO_JPEG = ROOT / "tmp" / "pdfs" / "rcp-hero-pdf.jpg"
LOGO_IMAGE = ROOT / "apple-touch-icon.png"

BLACK = HexColor("#090909")
INK = HexColor("#181818")
WHITE = HexColor("#FFFFFF")
PAPER = HexColor("#F7F7F4")
GOLD = HexColor("#F3C514")
PURPLE = HexColor("#5B2A82")
GREEN = HexColor("#08734F")
RED = HexColor("#B6312A")
MUTED = HexColor("#595959")
LINE = HexColor("#D5D0C5")

REGULAR = "RCPRegular"
BOLD = "RCPBold"


def register_fonts():
    pdfmetrics.registerFont(TTFont(REGULAR, r"C:\Windows\Fonts\arial.ttf"))
    pdfmetrics.registerFont(TTFont(BOLD, r"C:\Windows\Fonts\arialbd.ttf"))


def paragraph_style(size=8.0, leading=10.3, color=INK, font=REGULAR):
    return ParagraphStyle(
        name=f"p-{size}-{leading}-{font}",
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=color,
        alignment=TA_LEFT,
        spaceAfter=0,
        spaceBefore=0,
        allowWidows=0,
        allowOrphans=0,
    )


def draw_paragraph(pdf, text, x, y, width, size=8.0, leading=10.3, color=INK, font=REGULAR):
    para = Paragraph(escape(text).replace("\n", "<br/>"), paragraph_style(size, leading, color, font))
    _, height = para.wrap(width, 1000)
    para.drawOn(pdf, x, y - height)
    return y - height


def draw_rich_paragraph(pdf, text, x, y, width, size=8.0, leading=10.3, color=INK):
    para = Paragraph(text, paragraph_style(size, leading, color, REGULAR))
    _, height = para.wrap(width, 1000)
    para.drawOn(pdf, x, y - height)
    return y - height


def draw_section_title(pdf, title, x, y, width, accent=PURPLE):
    pdf.setFillColor(accent)
    pdf.roundRect(x, y - 12, 6, 14, 2, fill=1, stroke=0)
    pdf.setFillColor(INK)
    pdf.setFont(BOLD, 10.2)
    pdf.drawString(x + 12, y - 9, title.upper())
    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.7)
    pdf.line(x, y - 17, x + width, y - 17)
    return y - 27


def draw_bullet(pdf, text, x, y, width, size=7.7, leading=9.7):
    pdf.setFillColor(GOLD)
    pdf.roundRect(x, y - 5.2, 4, 2, 1, fill=1, stroke=0)
    return draw_paragraph(pdf, text, x + 10, y, width - 10, size, leading) - 3


def draw_labelled_item(pdf, label, text, x, y, width):
    y = draw_rich_paragraph(
        pdf,
        f'<font name="{BOLD}" color="#5B2A82">{escape(label.upper())}</font>',
        x,
        y,
        width,
        7.6,
        9,
    )
    y = draw_paragraph(pdf, text, x, y - 1, width, 7.6, 9.5)
    return y - 7


def generate():
    register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    HERO_JPEG.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(HERO_IMAGE) as hero:
        hero.convert("RGB").save(HERO_JPEG, "JPEG", quality=82, optimize=True, progressive=True)

    page_width, page_height = A4
    pdf = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    pdf.setTitle("Random Card Poker - Resumen ejecutivo")
    pdf.setSubject("Resumen comercial público para conversaciones B2B con operadores de casino")
    pdf.setAuthor("Random Card Poker")
    pdf.setCreator("Random Card Poker")

    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, page_width, page_height, fill=1, stroke=0)

    header_height = 158
    header_bottom = page_height - header_height
    pdf.saveState()
    clip = pdf.beginPath()
    clip.rect(0, header_bottom, page_width, header_height)
    pdf.clipPath(clip, stroke=0, fill=0)
    image_height = page_width * 844 / 1500
    pdf.drawImage(
        str(HERO_JPEG),
        0,
        header_bottom - 62,
        width=page_width,
        height=image_height,
        preserveAspectRatio=True,
        mask="auto",
    )
    pdf.setFillColor(BLACK)
    pdf.setFillAlpha(0.82)
    pdf.rect(0, header_bottom, page_width, header_height, fill=1, stroke=0)
    pdf.restoreState()

    pdf.setFillColor(GOLD)
    pdf.rect(0, header_bottom, 7, header_height, fill=1, stroke=0)
    pdf.drawImage(str(LOGO_IMAGE), 28, page_height - 93, width=59, height=59, mask="auto")

    pdf.setFillColor(WHITE)
    pdf.setFont(BOLD, 27)
    pdf.drawString(105, page_height - 57, "RANDOM CARD POKER")
    pdf.setFillColor(GOLD)
    pdf.setFont(BOLD, 10.2)
    pdf.drawString(106, page_height - 81, "JUEGO PROPIO DE PÓKER DE CASINO | RESUMEN EJECUTIVO")
    draw_paragraph(
        pdf,
        "Una base de póker familiar con una revelación comunitaria ciega y compartida mediante el Botón D™.",
        106,
        page_height - 101,
        page_width - 135,
        8.8,
        11.5,
        WHITE,
    )

    content_left = 38
    content_right = page_width - 38
    pdf.setStrokeColor(GOLD)
    pdf.setLineWidth(1.1)
    pdf.line(content_left, header_bottom - 20, content_right, header_bottom - 20)

    pdf.setFillColor(WHITE)
    pdf.roundRect(content_left, header_bottom - 58, content_right - content_left, 26, 6, fill=1, stroke=0)
    pdf.setFillColor(GREEN)
    pdf.setFont(BOLD, 8)
    pdf.drawString(content_left + 12, header_bottom - 48, "REVISIÓN B2B")
    pdf.setFillColor(MUTED)
    pdf.setFont(REGULAR, 7.8)
    pdf.drawString(
        content_left + 82,
        header_bottom - 48,
        "Para operadores, estudios de casino en vivo, proveedores, distribuidores y socios estratégicos.",
    )

    columns_top = header_bottom - 86
    gutter = 18
    column_width = (content_right - content_left - 2 * gutter) / 3
    x1 = content_left
    x2 = x1 + column_width + gutter
    x3 = x2 + column_width + gutter

    y1 = draw_section_title(pdf, "Qué es", x1, columns_top, column_width, PURPLE)
    y1 = draw_paragraph(
        pdf,
        "Random Card Poker es un juego propio de póker de casino. Los jugadores reciben cuatro cartas privadas, deciden entre JUGAR o RETIRARSE y completan su mano con una carta comunitaria seleccionada a ciegas.",
        x1,
        y1,
        column_width,
    )
    y1 = draw_paragraph(
        pdf,
        "El Botón D™ concentra la atención de la mesa en un momento de revelación compartida y reconocible.",
        x1,
        y1 - 8,
        column_width,
    )

    y1 = draw_section_title(pdf, "Flujo visible", x1, y1 - 19, column_width, RED)
    for item in (
        "1. APUESTA inicial y BONUS opcional",
        "2. Cuatro cartas privadas",
        "3. Decisión de JUGAR / RETIRARSE",
        "4. Activación del Botón D™",
        "5. Revelación de la carta comunitaria",
        "6. Resolución conforme a las reglas oficiales",
    ):
        y1 = draw_bullet(pdf, item, x1, y1, column_width, 7.5, 9.2)

    y1 = draw_section_title(pdf, "Valor comercial", x1, y1 - 13, column_width, GREEN)
    for item in (
        "Comprensión rápida para jugadores",
        "Momento visual para casino en vivo",
        "Formación clara para el dealer",
        "Diferenciación mediante el Botón D™",
        "BONUS opcional para agregar volatilidad",
        "Potencial para mesas, estudio y RNG",
    ):
        y1 = draw_bullet(pdf, item, x1, y1, column_width, 7.4, 9.1)

    y2 = draw_section_title(pdf, "Audiencias comerciales", x2, columns_top, column_width, PURPLE)
    y2 = draw_labelled_item(
        pdf,
        "Operadores de casino",
        "Evaluación de piso, flujo de mesa, procedimientos y encaje comercial.",
        x2,
        y2,
        column_width,
    )
    y2 = draw_labelled_item(
        pdf,
        "Estudios de casino en vivo",
        "Presentación ante cámara y momento de revelación para el presentador.",
        x2,
        y2,
        column_width,
    )
    y2 = draw_labelled_item(
        pdf,
        "Proveedores digitales",
        "Revisión de interfaz, lógica de revelación y adaptación a formatos RNG.",
        x2,
        y2,
        column_width,
    )
    y2 = draw_labelled_item(
        pdf,
        "Distribuidores y socios",
        "Conversaciones de territorio, licencia, formato y estrategia de mercado.",
        x2,
        y2,
        column_width,
    )

    y2 = draw_section_title(pdf, "Análisis independiente", x2, y2 - 12, column_width, GREEN)
    y2 = draw_paragraph(
        pdf,
        "Gaming Laboratories International (GLI) realizó un análisis matemático independiente de Random Card Poker.",
        x2,
        y2,
        column_width,
    )
    y2 = draw_rich_paragraph(
        pdf,
        f'<font name="{BOLD}">El análisis matemático independiente de GLI no constituye aprobación regulatoria, certificación ni autorización para operar en ninguna jurisdicción.</font>',
        x2,
        y2 - 8,
        column_width,
        7.6,
        9.8,
    )

    y3 = draw_section_title(pdf, "Paquete privado de revisión", x3, columns_top, column_width, PURPLE)
    for item in (
        "Reglas oficiales del juego",
        "Procedimientos del dealer",
        "Estructura de la tabla de pagos",
        "Resumen del análisis matemático",
        "Diseño de mesa y equipamiento",
        "Notas para presentación en vivo",
        "Conversación de licencia o distribución",
    ):
        y3 = draw_bullet(pdf, item, x3, y3, column_width, 7.5, 9.2)
    y3 = draw_paragraph(
        pdf,
        "Los materiales completos se comparten durante el proceso de revisión con partes calificadas.",
        x3,
        y3 - 7,
        column_width,
        7.6,
        9.6,
    )

    y3 = draw_section_title(pdf, "Origen y contacto", x3, y3 - 18, column_width, RED)
    y3 = draw_paragraph(
        pdf,
        "Creado por Gonzalo Iván Montoya Martínez a partir de su experiencia directa en operaciones de casino y administración de juegos de mesa.",
        x3,
        y3,
        column_width,
        7.7,
        9.8,
    )
    y3 = draw_rich_paragraph(
        pdf,
        f'<font name="{BOLD}">Monterrey, Nuevo León, México</font><br/><font color="#5B2A82">gm@randomcardpoker.com</font>',
        x3,
        y3 - 8,
        column_width,
        7.7,
        10.2,
    )

    cta_y = 90
    cta_height = 76
    pdf.setFillColor(BLACK)
    pdf.roundRect(content_left, cta_y, content_right - content_left, cta_height, 8, fill=1, stroke=0)
    pdf.setFillColor(GOLD)
    pdf.setFont(BOLD, 12.5)
    pdf.drawString(content_left + 18, cta_y + 49, "Solicite una revisión comercial")
    pdf.setFillColor(WHITE)
    pdf.setFont(REGULAR, 8.2)
    pdf.drawString(content_left + 18, cta_y + 30, "Demo privada | evaluación de operador | licencia | distribución | alianza estratégica")
    pdf.setFillColor(GOLD)
    pdf.setFont(BOLD, 8.5)
    pdf.drawRightString(content_right - 18, cta_y + 47, "randomcardpoker.com")
    pdf.drawRightString(content_right - 18, cta_y + 28, "gm@randomcardpoker.com")
    pdf.linkURL(
        "https://randomcardpoker.com/#contact",
        (content_left, cta_y, content_right, cta_y + cta_height),
        relative=0,
        thickness=0,
    )

    disclaimer = (
        "Resumen público para evaluación comercial. No constituye una oferta para operar, distribuir o suministrar "
        "el juego en ninguna jurisdicción. No se incluyen tablas de pago completas, matemática sensible ni términos "
        "comerciales finales."
    )
    draw_paragraph(pdf, disclaimer, content_left, 66, content_right - content_left, 6.8, 8.7, MUTED)
    pdf.setFillColor(GOLD)
    pdf.rect(content_left, 28, 24, 3, fill=1, stroke=0)
    pdf.setFillColor(MUTED)
    pdf.setFont(REGULAR, 6.5)
    pdf.drawRightString(content_right, 27, "Random Card Poker | Documento público | 2026")

    pdf.showPage()
    pdf.save()
    copyfile(OUTPUT, PUBLIC_OUTPUT)


if __name__ == "__main__":
    generate()
