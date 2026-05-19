// ================================================================
//  InternSync — Mentor Shared Navbar  (nav1.js)
//  ✏️  EDIT ONLY THIS SECTION to update across ALL mentor pages:
// ================================================================
var IS_NAV_CONFIG = {
  name:       "Raj Sharma",
  initials:   "RS",
  avatarColor:"linear-gradient(135deg,#2dd4bf,#0f766e)",
  photoURL:    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSEhAWFRUXFhcWFRgWFhUWFxYVFRcXFxUVFxUYHSggGBolHRcVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQGi0lICUtLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAABAAIEBQYDBwj/xABFEAABAwEFBAgCBQoGAgMAAAABAAIRAwQFEiExBkFRYRMiMnGBkaHRUrEWQlPB8AcUFSNDYnKSouEzY4KTsvEkwjRU0v/EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/EACIRAAICAwEAAwEAAwAAAAAAAAABAhEDEiExMkFRIgRCYf/aAAwDAQACEQMRAD8A9UCcmhOXOdA5EIBFADkCkkUARLYOq7uPyXiuPKoP4PRxC9stIyPcV4fVdDqo5/J5US9NI+HezvLXAg5qzbejowgKnoguMBXNkYynnqeJUZHH7RtiUn5xEyw2DF1qziM8hx71Kt14hjejpCN2XPcFU2u85EDxK0GylxzFesMtabf/AGKIJv0JyinzpMuC5+hZ01QTUdpP1QfvXK94YMwMTtTwbuC0lWmXZ8Fn78u2qMx1xMmBmFU1wiD70g0rXhpOH1jBy4TxUAXmWxyOfcVzr1soHcrOjcNd7B0jAGQTJIDmhZwgn6aZJ14T9j3ksqYBmXnE4xAG4DiVN2iuwVKII/xGiWk6n90qu2TtTWUyxjw7Mu4EciNxyVxehNRzAD1XGJHAq5vVWZQW0qZF2crUqdKBOI9p5bqd4Hcu5c3FjojWZgZBxAzlWFWxs6Lo29UDsxuKrKFF7KZqOfmZDWgCMsuGqdtPvgqT8K3aJjhZ2tzxF0+SydCm41Jc6ADnAmCNMlbX1a64wue4jrZaZeSoDXOfW1MlaLpDVEmuxofIJPWyyy14qy2UfNub/FU+SoGOOIZ7x81c7Fmbc3vqJP1DXxZ62xPlc2J4WhiIppTimlADSmFPKYUhjCmpxTSgoaU1OKaUgBCCKSYHROCaiFADwimhFMAhIlJAoA419CvC7ZlVrD953pUK90qrwy9jForj96p/zlRI0gdrPUhdqtUn2ChgFpbI1EjuKe+vGQGe9TXTRS5Rf7K3SKtTHV7LdB8TvYL0ZjvILzO6KxxNMnIQIOQC3N21HGniIxTw1KN+0Dx0rLtlUFUm020H5thDWhznaTpA1XFl4YX6mAYLTrCi2m2sdVaHND2/VcQCPPimpWiHCmUVkL6tUPFOZfwOEEnj6ra20uZSdLi44SCDocs8lKpva1gIAiJgAKJelp6oiOSHxD62eaWeq6m6AS140jv9lasvM1HML3FrmkQ5uhz3hHa7rVG1cg8UmOPfiyVR04MRADs/4XbwqJPSLttrqpDW8M+A5yFOtFGBgYMR3nh7LN7PXzQoWeMbW1DJfOpzOnHchYNtKOJ2MObiiCRIyngp1Ht0qtuA6nhaMzr3lZqr2cUa+YV3tNeTa729EZOefBUlrc8t6x07gqj4kEl6xof1h3j5q82EdNtHfUWbpPzHePmtB+T0/wDmDuqfNN+kL4s9hYU+VypldAVoZhKaUSU0pAAphTyUwoAYUCiUCgaGlNTimpDAklKSLAenBNCKkY5GU0FFAhyBKCRKYHKqvDdoMrVaO9/3Fe41CvEdp2xba45u9WhQ/S4ka0Wg4KRPwkDwK5NdK49NNNjSM2k+qdSfkmwTNHcloa1zXO0acx7r0C77U2pTBBiZ6g0jQLyixWjcdJWisd9ilOHhl3rNcbNpVJI0jqjaP+O8DHkxolxPCBuWcven0VQHpJkmA36vgqnaW9OnqteGkHCBHMcF0uuztIeD1nggjhGUgzyWkY8MZS6a0bSijZ8bw46NaIzcSDA5aeiwltv+u84S/CNwaYEcCdSuW3lscytTp4AwdGHkfEXEtxHwbks62nUqaN8U6SQnJt8NE29ZacTjnGKXSDGmuai0r7p4sD2dUnVpz5EJt0bL1HxjMN1hWFu2YaxmJv1c+8KXkinRaxTauibdl0vrObEhjph53gawtjT2WszaUVQcUdsOMA8+CxOxu0QpucHA4RkAc8JmJHAFel1rTSp0ene1rsQB4iI0T7dC5rZ5u9ho1CJBLTGuXfkuF51wWneYXS+LzFeuS2m1g0AAjxMKDb3kN0Hfv8EV0NnrRGs1o6wEHUfNav8AJxnax3VPmFjLE84xJnMLY/k0P/lf6X/MKpekx+J7DSK6SuNIrqCqMwppKRKaSgAlAlKU0lAAKaUU0oGAppRKBSGNSSSQB0BRCaE4KRhCMpqSAHSgUkCUAc6i8W2vEW6tzP8A6Be01F49tlZXm3VC1hcOrMc2xqpZcTMNIAGac14Vg26z9g/+cI/os/YH/cVWTTIDa4CJtMjVTf0afsB/uIfo0/YN8aiVodMiWS1HGJgx8WitrLeFIF7XENLhLjJImcgOCiiwH7Gn/uf3QN3/AOVR/n/unuLUfeNOja7dTDjLTRaBEjrsLsp4QVrrDddBgjCMtFlrtsRbVY4NpNIJjC7ETiaWxHeQfBcrXYrbUcHBx1OTi7TccurruO5c+X+n6dOH+Y+G8qVqVJuIkADwCrH3vZqwLBWbnlkePNRatz1Ktkhz8NUHMjMRvUe6tkIOI1H6g9okZDc3gso611m8tvpGUq2B9mqVWAF0QcQByYd54DMeaks2krtpmjjlhByOcdy2d8WOKkEEte0NdpEsmMQ4EEhZhtk/z7J/SuqGTY48mLWqfpS0rccUgo1bxkEErQMso/8As2UfyqVSsjN9tsw7jT9lqmY1/wBMfY6wNRoHELdfkx/+T/of/wAgu1msVDfeFDzpf/lT9jLrp0bX+qtDKzTTd2HYi3MdqBCTTuxryj0mkukrlTXSVRIZQJQlCUAGUJSQJQAk0pIFAwJpTk0pANSRQRYD04FNRUjCEpQSlABlIoJSgBr1nb6uKnWJcaYLjv0PmtEUxzVLKXDz92x7fh/qch9DW/CPMreGkh0SmmVsYX6Fs+Bvqj9C6fwM8lueiR6JFMNjD/Qun8DP5UfoXT+Bn8oW36NLo06FZijsyKIL6bW4hEQ2J3feVxvO+WNGEQXThA5rcVKQIIOh1WG2lu1tN8FnUd2DJyMQROs6+BWGWH2dODJ/qQLXtDUp/q20eYJzDuc7lEZerw8NY5pxDE5rXA9HO8R9XIhMp0uhaGtol0dl2Br3fzOaT5rpUe5oL3tDXO88tJUUvo376zS3XQdWEuwnKHTMiZgt5p7dkqXAeQVPcVqrCm+vTdlThz2ES19IkNd3OaSHA8A4b1rLuv2hVgYwx5yDXECTr1Se181048b1tHFlyf1RXDZOlw9AiNlKPD0C02FOwp0RZmmbL0hu9Arm5rrZSJLQpoYu9EKkhN8OzU5MRWhAUpQQSAMoEoSgUWAZQSQSARTSiU0pgKUEEUgHylKaikUGUpQSQKgykChKUpWMKBRlCUACEoRlKUACEoRlKUABMK5W20imx1R2jWlx8BMLzS+9pKtaZdhZJGAHLLj8XirhByJlJI199bVUKAMOxu4NPV8Xe0rzO/dq6tplz3OFNrh1G5CGwTA3mCRnKp7VbXPqYSd3oooLsJaRGZ5yDJz4LVQSMnN2am2vtNB5YKmJurTxac2kd4IKr2CpUd1iVqNmG07ZYcNV2CpZhgx59gCWTxyyjWRlqpmyt30WVZqvzy6OWkNBOYLidHcJEZakwuN4pbUjujli42yRWs35nd1Zzsn1GtbHAOcAB35kn+ywt4Xk+nSD2nNr2zzByPzWv/Kxay2nSpgxieXR+7TEZ+Lh5Lzi1WkvY5hgNwzlqXggg55RlouzEtY0cWWW0rPQrs2oqgCKhiNHdYR4rR2HatpjpGeLc/6T7rym665wNngFaUrQQNVo4Rf0QpNHsFjt9Kr2Hg8tCPA5qdSXjV0XlUFroBjtHsxk7w44XDxBIXsVErCcdWbRlaO8oIJKbGGUEJQlIByBKEoSgAyhKCBKBjiU0lCUCUAJFNSQA6UpVDT2nokwA6e4lOO0tAZEuB5tKjZF6y/C9lKVRfSaz/EfIp30iofEfIotBq/wu5QlUh2kofEfIrm7aihxd5JbINX+F/iSxLOHaqh+95JjtsLMNS7yRaDVmmBSLllHbZUT/hhz+eQHql9Lm/ZO82+6doNWavEgXLLs2upn9m/+n3TztXR3tePAe6VoNWHbq29HZHgavIYP+R9GleS1baCSCd+XOQCfvWy27vtlanTbTxZOc4zluAHzXmtuqSZGR8sxmMvNdOP4nPk+VCxfrCfBSG1VCc+esN4n3XYO91oZmm2PaXvqU8ZAwtq4REPdRd1cUgzGMmOMHcFqL3lzejbEuqQARoHgEkgS2cwddx7hhbgtnRVmkfWDqfjUaWtz3dYtzWzsz6eME6hubnPkZNYZby6x01nXIqJJmkaMttj0jarKL6mPoqbWt4gEkgEnUwW+ip20er3z5D+8Kff1TpbVVdr1yPBvVHyXHDE+X3n7vJVFcIl6G7uyE+0XgJwtM8fDNV1ttOBhA1UGg8NAnXXvJ0+SqxGksFbDq6PrPcNZyw02eYz5817fcFt6ahTq73NGLk4ZO9QV8+WK1Qe1B4xizG5o4DOTr3ZL1r8m96tNnexz4LKhjFAJDgDpuzxeajJ5Zpj9o3cpSoX6Qp/at8wj+f0/tG+YWBrRMlCVCdeVLfVb5hc3XtRH7VvmgKZYygSq4XvRP7VvmpVKu1wlrgRyKAo7IEoApIAMoJISgBJJqCAIFmuWmzsNjmo9XZik8lxDp35q4ba/8t3kibWd1N3osKia3IoTstRmII8SutHZWjz8ZVwa7jozPmRouL3v4tHe5PgbSIDris7RLmjyWV2ptFFgDabABOZ3rS3i8x225TvK872xqENBy7Q0KS9KtrpGfaOBVZeNpIac0GVTCr70qdXxVpdBy4WNltRbEKbTtk5nJUFOoVIFchKhWW/50RxXQWswNZVSLTI1XQVjAGIooex0vOuSRwA1mMzrrlw4rNXiTMrR16kTx/Gqz94E5iR3Ae+ZXZFUkjhm7bZysT5bHA/PP5ypUb+H4Kq7G4hxHL5H+6sKddMklNqYSCNxBHgZC21GuCwOByLN1Mzhw0sUnjrnnv6wkLBNfP48lpbLasVkOphmE9fs4S0N6vPCNY0GsJMqJX0jq4nifdcateBz39+9RrVaIbA1J+Wf3KDVcTqVVknO8asjVcaDpd4BNtByKV39rf5x6ykI0Ngsgjd5Ez4DX0Wo2Ws5L3U2auHVDj8MyAdJz0HBUVlDi2AfE+w18VbXJVFnr06pLnYXDESfqnJ0DdkSnONxaLhLWSZsPo9XP1BzzC5foSuNKR8x7rcNyE8/we5IV4kkdy4qR2bsyl13G97nCs1zRGWmvFRb1uerSnCRUAzIb2gObVrrZbIYTMHcoFwvBa55mXOznPTQfNTasdv0wNS1RnpC0n5P7UXmtOktI8ZV9eVz2ev26YmO0MneYUC79mKdBxNKvVbOoJaQY5EKkxPqNICjiUSkS0daq094APoVGtV706fbePDNVsiNWWmJAlZ5m0o30z4FWlkvGnU7Ls+ByPkqsTTRNSXPGkgRD/SB4hNN5lVP5vUGrqYPN0pvQnfXp+Elcts6KRZuvDXPeuDrTO9QzSaNbQO8MK5ubR+3ee5oHzQB0rvkLB7aVJDeAcFrbW+n2WuqRvktBnwWO2qpNFKQXEhw1Mq4eky8KekclAvV2gUijUyUK8HyQtorpnJ8H6J7M+5MIlFtSEUOyYNF1ouJcFCNVS7vBMka6d3ON6cI9JnKkdLU+BmQ0cT7KktDZkh5PeS0eit7a2BIdmN5bi8hkAqQ1HOMOqSR9UjD8siuk5TlZbNLXu8o5Ti9CnNMqVZjhaG98+KhMO7goi7bKlGkjuHQe/L2U+xWn9XUZluOYk58Du0Pmqx+ibZ6hxeBnw/HqqJJFd0kZ6D5/wDS41HIVHGT+NFyeUAcqhnJSLubB1brvj71HKsbNSa8tgukzk0SctyEIvLPaIgAA/6mg+AHspAtYOWYPA5H+6fQsgAAIcRGjod4HJRLRrgIGRyzMjhrmBzBIWgHrF021lShSMuxGmyTjMThE5HmCpBqg5Fzgd+YPiBCyWyVYmgMWUFwEmTAMZ5DfPmr1j41dHCF5s/k0d8PEdb1qw3CK874LfSQo2zNtc4uYRk0nMeqh3xUEExpmeGX40R2Xyohx1dmfx5qGWaw1c0+qQd8eiqnWjmudprGOq6D+NUrHQrxscA43B7eZzCxdssLTXb0biADiImWwI04KZfPREHpG5xmS4jx1WLuK0gVXHG7CDAzn1WuOP2ZzlVI3soh0Z/JRrPWDhk6VIlaCJjb0rAR0hRUOUkASTVlc2v5rlUYYg1GjmASoz2f5p8GgLlNSzbUBkLlXqKsNdrZ67j5BRK1tZ8JPe4p0KyxfUHHeqbacYqTsxpIGui6/nrdzWj1TbdaS+m8Zdg5ADSFcX0mXhjaNbJcbSZcFCo112qVNDzC69aZz72iUXpuNcKlYLiaqSiDkTekVhddXdijXTUn2iFR9IrO53kzAmPvkj71cVTIlK0aJlIEb/NU99XO50ObmRzzI3hW9EmM9VJ6oEuIaOZWhmY6ztmSRk3X7gojndY961V93RUpN6To3im4yS5pbBO/MaGFzuzYa02mka7SxgJ/VipI6Qb3AgdUcCde7NZbRj1s10lJ0kZsPQYM55ErSWfYO3uBJoBkGOvUYMX8MEz3qLfmylpslPpKrBhJwkteHROkjnohTjdWS8c0raKPpFzJR6NTrsud9Y9XJo1cdPDirII9hsjqrwxu/UnQDiVtrBdjaHZOnaJ1Pijd93UqDYa3PeTmTCVpr1PqOB5QJ8J1WiVAdrTaGgHULO292LOSRyMOaeI5Tmule8dzyJ7o8CFEp0nvdFPrE8IyHE8ApkwSNlsZUxUTLyHNqFpOs5NIOe/MrV2VhGlVp5OaBPiszc1l6Kk1hIk9ZxG8nh4ADwVsxwGs+C4J9k2dsORSK/ah9QNOJ1ODkAx0xJjTjmpthdhptA3AfiVQ3wMT2N4u57s/ZaZll6olsgDUHP8AupLQBbfxmVzr13EdUTzC5VLtdMseR/EEPzZw7TXU3fEwy081BZmdo7QRSdmM8sifHLcspczoGXFaLbF4DM4Lp1GR36rN3Z2V041/By5H/ZobFbS0zJjepzdpnnSmI3SfnkqBjkmHIJjs0H0if8DfP+yKzuJJAWai1bRUQTD5Va+/gTkHO7mlOp2djdGN8gu2IDcstUa9ID7dVdmKTvGB81ycLQfqNHe72Vp0gTumRz8CindY651qAdwKfTsdUftneACthUPFIuTsNUQad3s+zBPMBdDY6Z1pN8lOAHBBwG9GzHqirq3RRP7LyMLiLiofAfMq4JCEJ7P9J0j+EO7tkKVeo2mzFJ3zkBvJWvv3ZGlQszW2ZsOZmT9apPaxHeeG4aCAhsWcNR5I+qAOQJk/ILQXnaMQy0VxkyJQX4eaWIl8BoknILd0bgpUm2dzgHVOu8k59bq4Y4ADF4leW7ag067TTJbq5sEiCdYI7irTZ/aq21qlFhDagYHNJMslriJLjpIjKBv5q8qlKPCMMoxn09TpVwRBjPLrCRPMb0bMAS7HUFQ7ppgNaNwaJMd6r5ZUYekANNxDXGcwTpB1GZHolZbubRe53SNqM17RDxyLRkfDyXm+Hqkm33pTpgte3qnUgHAe8js+MKBf1mZarG+g0jEQOjJdkHAgtk7xIHmpNV1J+bHOZ+804m+R91Tfo6oyrjFQPYesQMsxniw7vBVF07QSinGmUF3/AJNnnO02hoHw0pcT/rcBHkVJvmzCywylnTjq5ZiNQ6Pmr+1XgTlp3KmvasQwuIEjMA6H90jgRIPeVvDPPa2csv8AGx6tL0zlW0uP1lWV7bzUvaGy9DXfSAIb1XNnXC5ocATviSJ5IXbdrqr2tc3LfxXc5I85Rd0Pua6a1rcGtALJze4dnuOpV9a9nDYR/iOLKjsnANkGB1XeRIW1uCiym0Ma0ABTdoKbK1B9N43ZHgfqnwMLGT2RtGOpgKFd2IDG0QAMxrzKuWVHRkGuO6HgT5rIXba8TiTnwG85DJXzaFBjTVtbnH4WMME8AFgbJnKJtVNpyIkkcMxv36LZ2Zo35Lyj6QtNsxNbhYAGtBJJjXU7816BdF5te3KSeABJ8oSnFocWmX1psZIlp9PwFQXjmCCXNjXDI9FLtNpe3MNrN5hmRWdvm0lwJe6qABJxAtHmFHpfhjNrrSJwN895niq+wmAoN4Vi95JJ8TJ81MspyHcu1R1ikcW20mywa7RPZoFHY7Nd2HJQzRCJQTpSSsDRGwVOEeI90qd2vO6fEe6SSnU02Z2bYHfD6j3S/MX/AAnzb7pJI1DYAsdTc31b7o/mdT4fUe6SSNQ2YjZKnD/j7pjrvqH/ALHugkjUNmI2Cp8PqPdFtkqAdjvzb7oJJqKFsy42aFRtQtLcnNO8ZYZI0Pery0UnRp6hJJOhWZa+rlFYjGzQGIPGOB5KDRubB2aeBzRIgiHtBDs853ZEwfBJJUiH+mkuS0uBIeCZAEGCHcZz1Ug2d3SOlznMJyb1QRlpiGZCSS5ssVZ2YJvUi2i4ATiZVr0jrk9pHqlTsFWm1xdWdUOgBDRrrmEUlNGrkcsBbkGy48xA9VFvOz18AdTpMqEGS15jE3UgODgAddZGaSS6McEceTJJspaF3WmvWfXtQGM9kAthsR1RB0aD5+Zu7ssDpxYe7Me6SSuSMos0VnY8bvUJ9qc/C4EfVJ3aASQikpSLbPJhs7aWHFTfnzIH3q0ur89pO/W08bTk7C6mXRyxHI+KSSp99IXPCsvLZt76j6jGloc6Wglsjvgx5KTcla12ZwDmnDxa5nyJSSTrbjE3r1HoLa1StSnpH0xGeCMR4daVh9qrutjcjUqPY7QONOTvzhySSyhFKReST1MmbltEz0f9TPdT6F2Vo/w/6me6SS6Wjmi6O7btrSP1f9TfdSWXbV+D1b7pJKGjVSD+j6vwerfdFJJLVD2Z/9k=",
         
  logoutURL:  "auth.html",
  showBack:   true,
  backURL:    "main.html"
};
// ================================================================

(function(cfg){

  // ── Inject Google Fonts (once) ────────────────────────────
  if (!document.getElementById('is-nav-fonts')) {
    var lnk = document.createElement('link');
    lnk.id  = 'is-nav-fonts';
    lnk.rel = 'stylesheet';
    lnk.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap';
    document.head.appendChild(lnk);
  }

  // ── Inject CSS (once) ─────────────────────────────────────
  if (!document.getElementById('is-nav-css')) {
    var s = document.createElement('style');
    s.id  = 'is-nav-css';
    s.textContent = `
      :root{
        --accent:#d9a441; --accent2:#f0c060; --bg:#0f1209;
        --text:#f0ede4; --muted:rgba(240,237,228,0.45);
        --teal:#2dd4bf; --red:#ff6b6b; --green:#4ade80;
      }

      /* ── NAV ── */
      .is-nav{
        position:relative; z-index:20;
        background:rgba(10,13,6,.88); backdrop-filter:blur(24px);
        border-bottom:1px solid rgba(255,255,255,.07);
        padding:14px 32px;
        display:flex; justify-content:space-between; align-items:center;
        flex-shrink:0; font-family:'DM Sans',sans-serif;
      }
      .is-nav-left  { display:flex; align-items:center; gap:14px; }
      .is-nav-right { display:flex; align-items:center; gap:14px; }

      /* ── LOGO ── */
      .is-logo{ position:relative; width:48px; height:44px; flex-shrink:0; }
      .is-logo .il{
        position:absolute; top:50%; left:50%;
        transform:translate(-50%,-50%);
        font-family:'Georgia',serif; font-size:42px;
        font-weight:bold; line-height:1; user-select:none;
      }
      .is-logo .il-i{ color:#fff; z-index:1; }
      .is-logo .il-s{
        color:transparent; z-index:2;
        background:linear-gradient(120deg,transparent 28%,var(--accent) 50%,transparent 72%);
        background-size:200% 100%;
        -webkit-background-clip:text; background-clip:text;
        animation:is-shimmer 3s infinite linear;
      }
      @keyframes is-shimmer{
        from{ background-position:-200% 0 }
        to  { background-position: 200% 0 }
      }

      /* ── BACK BUTTON ── */
      .is-back-btn{
        display:flex; align-items:center; gap:7px;
        background:transparent; border:1.5px solid rgba(217,164,65,.5);
        color:var(--accent); padding:7px 18px; border-radius:30px;
        font-family:'Syne',sans-serif; font-size:12px; font-weight:700;
        cursor:pointer; letter-spacing:.4px;
        transition:background .25s, box-shadow .25s, border-color .25s;
      }
      .is-back-btn:hover{ background:rgba(217,164,65,.1); box-shadow:0 0 16px rgba(217,164,65,.25); }

      /* ── NAV NAME ── */
      .is-nav-name{ font-family:'Syne',sans-serif; font-size:14px; font-weight:600; color:var(--text); }

      /* ── AVATAR ── */
      .is-avatar{
        width:36px; height:36px; border-radius:50%;
        display:flex; align-items:center; justify-content:center;
        font-family:'Syne',sans-serif; font-weight:700; font-size:14px;
        color:#fff; border:2px solid rgba(45,212,191,.4);
        cursor:pointer; flex-shrink:0; overflow:hidden; padding:0;
        transition:border-color .25s, box-shadow .25s;
      }
      .is-avatar:hover{ border-color:var(--teal); box-shadow:0 0 12px rgba(45,212,191,.35); }
      .is-avatar img{
        width:100%; height:100%;
        object-fit:cover; object-position:center top;
        display:block; border-radius:50%;
      }

      /* ── LOGOUT ── */
      .is-btn-logout{
        padding:7px 18px; border-radius:30px;
        background:transparent; border:1.5px solid rgba(217,164,65,.4);
        color:var(--accent); font-family:'DM Sans',sans-serif;
        font-size:12px; font-weight:500; cursor:pointer; letter-spacing:.3px;
        transition:background .25s, box-shadow .25s, border-color .25s, letter-spacing .25s;
      }
      .is-btn-logout:hover{
        background:rgba(217,164,65,.12); border-color:var(--accent);
        box-shadow:0 0 14px rgba(217,164,65,.22); letter-spacing:1px;
      }

      /* ── BELL ── */
      .is-notif-wrap{ position:relative; }
      .is-bell-btn{
        width:38px; height:38px; border-radius:50%;
        background:rgba(255,255,255,.055); border:1px solid rgba(255,255,255,.1);
        display:flex; align-items:center; justify-content:center;
        cursor:pointer; position:relative; flex-shrink:0;
        transition:background .2s, border-color .2s, box-shadow .2s;
      }
      .is-bell-btn:hover{ background:rgba(217,164,65,.12); border-color:rgba(217,164,65,.35); box-shadow:0 0 16px rgba(217,164,65,.2); }
      .is-bell-btn svg{ width:17px; height:17px; stroke:var(--muted); transition:stroke .2s; }
      .is-bell-btn:hover svg, .is-bell-btn.has-new svg{ stroke:var(--accent); }
      .is-bell-btn.has-new svg{ animation:is-bell-ring .6s ease 0s 2; }
      @keyframes is-bell-ring{
        0%{transform:rotate(0)} 15%{transform:rotate(18deg)} 30%{transform:rotate(-14deg)}
        45%{transform:rotate(10deg)} 60%{transform:rotate(-6deg)} 75%{transform:rotate(3deg)} 100%{transform:rotate(0)}
      }
      .is-bell-count{
        position:absolute; top:-4px; right:-4px;
        min-width:17px; height:17px; background:var(--red);
        border-radius:10px; border:1.5px solid rgba(10,13,6,.9);
        font-family:'Syne',sans-serif; font-size:9px; font-weight:700; color:#fff;
        display:flex; align-items:center; justify-content:center; padding:0 4px; line-height:1;
      }
      .is-bell-count.hidden{ display:none; }

      /* ── DROPDOWN ── */
      .is-notif-dropdown{
        position:absolute; top:calc(100% + 12px); right:0; width:340px;
        background:#141810; border:1px solid rgba(217,164,65,.22);
        border-radius:18px; box-shadow:0 24px 60px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.04);
        z-index:9999; overflow:hidden; opacity:0; pointer-events:none;
        transform:translateY(10px) scale(.97);
        transition:opacity .22s cubic-bezier(.22,1,.36,1), transform .22s cubic-bezier(.22,1,.36,1);
      }
      .is-notif-dropdown.open{ opacity:1; pointer-events:auto; transform:translateY(0) scale(1); }
      .is-notif-header{
        display:flex; align-items:center; justify-content:space-between;
        padding:14px 16px 10px; border-bottom:1px solid rgba(255,255,255,.06);
      }
      .is-notif-header-title{ font-family:'Syne',sans-serif; font-size:11px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--accent); }
      .is-mark-read{ font-size:11px; color:var(--muted); background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; transition:color .2s; padding:0; }
      .is-mark-read:hover{ color:var(--accent); }
      .is-notif-list{ max-height:320px; overflow-y:auto; }
      .is-notif-list::-webkit-scrollbar{ width:3px; }
      .is-notif-list::-webkit-scrollbar-thumb{ background:rgba(217,164,65,.15); border-radius:4px; }
      .is-notif-item{
        display:flex; align-items:flex-start; gap:11px; padding:12px 16px;
        border-bottom:1px solid rgba(255,255,255,.04); cursor:pointer; position:relative;
        transition:background .18s;
      }
      .is-notif-item:last-child{ border-bottom:none; }
      .is-notif-item:hover{ background:rgba(255,255,255,.03); }
      .is-notif-item.unread{ background:rgba(217,164,65,.04); }
      .is-notif-item.unread::before{
        content:''; position:absolute; left:0; top:0; bottom:0;
        width:2px; background:var(--accent); border-radius:0 2px 2px 0;
      }
      .is-ni{ width:32px; height:32px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
      .is-ni svg{ width:14px; height:14px; }
      .is-ni-sub  { background:rgba(255,107,107,.12); border:1px solid rgba(255,107,107,.2); }
      .is-ni-sub  svg{ stroke:var(--red); }
      .is-ni-task { background:rgba(217,164,65,.12);  border:1px solid rgba(217,164,65,.2);  }
      .is-ni-task svg{ stroke:var(--accent); }
      .is-ni-leave{ background:rgba(45,212,191,.1);   border:1px solid rgba(45,212,191,.2);  }
      .is-ni-leave svg{ stroke:var(--teal); }
      .is-ni-chat { background:rgba(168,85,247,.1);   border:1px solid rgba(168,85,247,.2);  }
      .is-ni-chat svg{ stroke:#c084fc; }
      .is-notif-body{ flex:1; min-width:0; }
      .is-notif-msg{ font-size:12px; font-weight:500; color:var(--text); line-height:1.4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .is-notif-item.unread .is-notif-msg{ font-weight:600; }
      .is-notif-sub{ font-size:10px; color:var(--muted); margin-top:2px; }
      .is-notif-time{ font-size:9px; color:rgba(240,237,228,.3); font-family:'Syne',sans-serif; flex-shrink:0; margin-top:2px; }
    `;
    document.head.appendChild(s);
  }

  // ── SVG helpers ───────────────────────────────────────────
  var SVG = {
    back:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    bell:   '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    cal:    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    check:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
    chat:   '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>'
  };

  // ── Default notifications ─────────────────────────────────
  var DEFAULT_NOTIFS = [
    { id:'n1', icon:'sub',   msg:'Monisha K submitted Database Optimisation',    sub:'Full Stack Intern · Awaiting your review',   time:'2h ago',  unread:true  },
    { id:'n2', icon:'leave', msg:'Fiona Shalet requested Sick Leave',             sub:'27 March 2026 · 1 day',                      time:'3h ago',  unread:true  },
    { id:'n3', icon:'sub',   msg:'Stella Mary submitted REST API Documentation', sub:'Backend Intern · Submitted yesterday',        time:'1d ago',  unread:true  },
    { id:'n4', icon:'task',  msg:'Shonn Dias is falling behind on assigned tasks',sub:'Only 38% progress · Needs attention',        time:'2d ago',  unread:true  },
    { id:'n5', icon:'chat',  msg:'Deekshitha S sent you a message',               sub:'Frontend Intern · "Quick question about..."', time:'3d ago',  unread:false },
    { id:'n6', icon:'leave', msg:'Stella Mary requested Personal Leave',          sub:'29 March 2026 · 2 days',                     time:'3d ago',  unread:false }
  ];

  function iconChip(type) {
    var map    = { sub:'is-ni-sub', leave:'is-ni-leave', task:'is-ni-task', chat:'is-ni-chat' };
    var svgMap = { sub:SVG.upload, leave:SVG.cal, task:SVG.check, chat:SVG.chat };
    return '<div class="is-ni '+(map[type]||'is-ni-task')+'">'+(svgMap[type]||'')+'</div>';
  }

  function buildItem(n) {
    return '<div class="is-notif-item '+(n.unread?'unread':'')+'" data-id="'+n.id+'">'
      +iconChip(n.icon)
      +'<div class="is-notif-body">'
        +'<div class="is-notif-msg">'+n.msg+'</div>'
        +'<div class="is-notif-sub">'+n.sub+'</div>'
      +'</div>'
      +'<div class="is-notif-time">'+n.time+'</div>'
    +'</div>';
  }

  function refreshBadge() {
    var n   = document.querySelectorAll('.is-notif-item.unread').length;
    var btn = document.getElementById('is-bell-btn');
    var bdg = document.getElementById('is-bell-count');
    bdg.textContent = n;
    if (n > 0) { bdg.classList.remove('hidden'); btn.classList.add('has-new'); }
    else        { bdg.classList.add('hidden');    btn.classList.remove('has-new'); }
  }

  // ── Avatar: photo if set, else initials ───────────────────
  var avatarInner = cfg.photoURL
    ? '<img src="'+cfg.photoURL+'" alt="'+cfg.name+'" />'
    : cfg.initials;

  // ── Build nav ─────────────────────────────────────────────
  var backBtn     = cfg.showBack
    ? '<button class="is-back-btn" id="is-back-btn">'+SVG.back+'Back</button>'
    : '';
  var unreadCount = DEFAULT_NOTIFS.filter(function(n){ return n.unread; }).length;

  var nav = document.createElement('nav');
  nav.className = 'is-nav';
  nav.innerHTML =
    '<div class="is-nav-left">'
      +backBtn
      +'<div class="is-logo"><span class="il il-i">I</span><span class="il il-s">S</span></div>'
    +'</div>'
    +'<div class="is-nav-right">'
      +'<span class="is-nav-name">'+cfg.name+'</span>'
      // ── Avatar comes BEFORE bell ──
      +'<div class="is-avatar" id="is-avatar" style="background:'+cfg.avatarColor+';" onclick="window.location.href=\'mentor-profile.html\'">'+avatarInner+'</div>'
      // ── Bell icon ──
      +'<div class="is-notif-wrap" id="is-notif-wrap">'
        +'<button class="is-bell-btn has-new" id="is-bell-btn">'+SVG.bell+'</button>'
        +'<span class="is-bell-count" id="is-bell-count">'+unreadCount+'</span>'
        +'<div class="is-notif-dropdown" id="is-notif-dropdown">'
          +'<div class="is-notif-header">'
            +'<span class="is-notif-header-title">Notifications</span>'
            // ── "Mark all read" same style as nav.js ──
            +'<button class="is-mark-read" id="is-mark-read">Mark all read</button>'
          +'</div>'
          +'<div class="is-notif-list" id="is-notif-list">'+DEFAULT_NOTIFS.map(buildItem).join('')+'</div>'
        +'</div>'
      +'</div>'
      +'<button class="is-btn-logout" id="is-btn-logout">Logout</button>'
    +'</div>';

  document.body.insertBefore(nav, document.body.firstChild);

  // ── Events ────────────────────────────────────────────────
  if (cfg.showBack) {
    document.getElementById('is-back-btn').addEventListener('click', function(){
      window.location.href = cfg.backURL;
    });
  }

  document.getElementById('is-btn-logout').addEventListener('click', function(){
    window.location.href = cfg.logoutURL;
  });

  document.getElementById('is-bell-btn').addEventListener('click', function(e){
    e.stopPropagation();
    document.getElementById('is-notif-dropdown').classList.toggle('open');
  });

  document.addEventListener('click', function(e){
    if (!e.target.closest('#is-notif-wrap'))
      document.getElementById('is-notif-dropdown').classList.remove('open');
  });

  document.getElementById('is-notif-list').addEventListener('click', function(e){
    var item = e.target.closest('.is-notif-item');
    if (!item) return;
    item.classList.remove('unread');
    refreshBadge();
  });

  // ── Mark all read (same behaviour as nav.js) ──────────────
  document.getElementById('is-mark-read').addEventListener('click', function(){
    document.querySelectorAll('.is-notif-item').forEach(function(el){
      el.classList.remove('unread');
      el.classList.add('read');
    });
    document.getElementById('is-bell-count').classList.add('hidden');
    document.getElementById('is-bell-btn').classList.remove('has-new');
  });

  refreshBadge();

})(IS_NAV_CONFIG);