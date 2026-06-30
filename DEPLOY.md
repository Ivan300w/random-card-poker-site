# Migrar `randomcardpoker.com` fuera de Hostinger Builder

Objetivo: conservar el dominio en Hostinger, pero publicar la página como sitio
estático para no pagar por ediciones en el Website Builder.

## Opción recomendada: GitHub Pages

1. Crea un repositorio en GitHub, por ejemplo `random-card-poker-site`.
2. Sube estos archivos al repositorio:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `CNAME`
   - `.nojekyll`
3. En GitHub, entra a `Settings > Pages`.
4. En `Build and deployment`, selecciona:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. En `Custom domain`, usa:

   ```text
   randomcardpoker.com
   ```

6. Activa `Enforce HTTPS` cuando GitHub lo permita.

## DNS en Hostinger

En Hostinger, ve a `Domains > DNS` y edita `randomcardpoker.com`.

Elimina o reemplaza los registros actuales del Website Builder:

```text
@     A       88.222.222.32
@     A       84.32.84.1
www   CNAME   connect.hostinger.com
```

Agrega estos registros para GitHub Pages:

```text
@     A       185.199.108.153
@     A       185.199.109.153
@     A       185.199.110.153
@     A       185.199.111.153
www   CNAME   TU-USUARIO.github.io
```

Reemplaza `TU-USUARIO` por tu usuario u organización de GitHub.

## Importante si usas correo del dominio

El correo `gm@randomcardpoker.com` puede seguir funcionando en Hostinger Mail.
Para eso, no cambies nameservers si no vas a copiar todos los registros de
correo; lo más simple es mantener la zona DNS en Hostinger y cambiar solo los
registros web indicados arriba.

No borres registros `MX`, `TXT`, `SPF`, `DKIM` o `DMARC`. Ahora mismo el dominio
usa estos registros de correo:

```text
@       MX      mx1.hostinger.com      prioridad 5
@       MX      mx2.hostinger.com      prioridad 10
@       TXT     v=spf1 include:_spf.mail.hostinger.com ~all
_dmarc  TXT     v=DMARC1; p=none
hostingermail-a._domainkey  CNAME  hostingermail-a.dkim.mail.hostinger.com
hostingermail-b._domainkey  CNAME  hostingermail-b.dkim.mail.hostinger.com
```

El correo entrante depende de los `MX`. El envío confiable depende del `SPF`,
`DKIM` y `DMARC`, así que esos también deben quedarse.

## Tiempo de propagación

El cambio puede verse en minutos, pero la propagación completa puede tardar
hasta 24 horas. El certificado HTTPS de GitHub normalmente aparece después de
que el DNS ya apunta correctamente.
