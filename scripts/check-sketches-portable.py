"""Run the preserved host mocks with a Clang-only unused-stub warning adaptation.
This does not compile against Arduino cores and cannot verify physical hardware.
"""
from pathlib import Path
import subprocess
source=Path(__file__).resolve().parents[1]/'source/original/tests/check_sketches.py'
text=source.read_text()
# Apple Clang warns about mock Arduino constants unused by individual sketches.
# Mark only the stub constants maybe_unused; sketches and assertions are unchanged.
text=text.replace('const int HIGH=1','[[maybe_unused]] const int HIGH=1')
try:
    exec(compile(text,str(source),'exec'),{'__file__':str(source),'__name__':'__main__'})
except subprocess.CalledProcessError as exc:
    print(exc.stderr.decode() if isinstance(exc.stderr,bytes) else exc.stderr)
    raise
