from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "rcp-hero-operator-review.webp"
LOGO = ROOT / "apple-touch-icon.png"
OUTPUT = ROOT / "assets" / "rcp-og-image-es.png"

WIDTH = 1200
HEIGHT = 630
GOLD = "#F3C514"
WHITE = "#FFFFFF"
MUTED = "#E4E0D9"


def font(name: str, size: int):
    return ImageFont.truetype(str(Path(r"C:\Windows\Fonts") / name), size)


def draw_shadowed_text(draw, position, text, text_font, fill, spacing=4):
    x, y = position
    draw.multiline_text(
        (x + 2, y + 3),
        text,
        font=text_font,
        fill=(0, 0, 0, 185),
        spacing=spacing,
    )
    draw.multiline_text(
        position,
        text,
        font=text_font,
        fill=fill,
        spacing=spacing,
    )


def generate():
    with Image.open(SOURCE) as source:
        image = ImageOps.fit(
            source.convert("RGB"),
            (WIDTH, HEIGHT),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )

    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    pixels = overlay.load()
    for x in range(WIDTH):
        if x <= 600:
            alpha = 238
        elif x <= 900:
            alpha = round(238 - ((x - 600) / 300) * 170)
        else:
            alpha = 68
        for y in range(HEIGHT):
            vertical = 26 if y > 500 else 0
            pixels[x, y] = (2, 2, 2, min(245, alpha + vertical))
    image = Image.alpha_composite(image.convert("RGBA"), overlay)

    vignette = Image.new("L", (WIDTH, HEIGHT), 0)
    vignette_draw = ImageDraw.Draw(vignette)
    vignette_draw.ellipse((-200, -240, WIDTH + 220, HEIGHT + 260), fill=205)
    vignette = vignette.filter(ImageFilter.GaussianBlur(105))
    edge = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 150))
    edge.putalpha(ImageOps.invert(vignette))
    image = Image.alpha_composite(image, edge)

    draw = ImageDraw.Draw(image)
    with Image.open(LOGO) as logo_source:
        logo = logo_source.convert("RGBA").resize((82, 82), Image.Resampling.LANCZOS)
    image.alpha_composite(logo, (72, 58))

    draw.text(
        (176, 75),
        "JUEGO PROPIO DE PÓKER DE CASINO",
        font=font("arialbd.ttf", 23),
        fill=GOLD,
    )
    draw.text(
        (176, 108),
        "PARA OPERADORES Y SOCIOS ESTRATÉGICOS",
        font=font("arial.ttf", 18),
        fill=MUTED,
    )

    draw_shadowed_text(
        draw,
        (72, 184),
        "Random Card\nPoker",
        font("arialbd.ttf", 70),
        WHITE,
        spacing=-3,
    )

    draw_shadowed_text(
        draw,
        (76, 365),
        "Una base familiar de póker con una\nmecánica de revelación distintiva.",
        font("arial.ttf", 29),
        WHITE,
        spacing=10,
    )

    pill_y = 508
    pill_one = (72, pill_y, 248, pill_y + 54)
    pill_two = (264, pill_y, 470, pill_y + 54)
    draw.rounded_rectangle(pill_one, radius=8, fill=GOLD)
    draw.rounded_rectangle(
        pill_two,
        radius=8,
        fill=(12, 12, 12, 210),
        outline=(255, 255, 255, 105),
        width=2,
    )
    draw.text(
        (160, pill_y + 27),
        "BOTÓN D™",
        font=font("arialbd.ttf", 19),
        fill="#111111",
        anchor="mm",
    )
    draw.text(
        (367, pill_y + 27),
        "REVISIÓN B2B",
        font=font("arialbd.ttf", 18),
        fill=WHITE,
        anchor="mm",
    )

    draw.text(
        (74, 590),
        "randomcardpoker.com",
        font=font("arialbd.ttf", 17),
        fill=MUTED,
        anchor="lm",
    )

    image.convert("RGB").save(OUTPUT, "PNG", optimize=True)
    print(f"Generated {OUTPUT} ({OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    generate()
