#!/usr/bin/env bash
# Crea las etiquetas del flujo de trabajo (docs/workflow.md) en el repo de GitHub actual.
# Ejecutar una vez, después de crear el repo remoto: ./scripts/setup-github-labels.sh
set -euo pipefail

create() {
  gh label create "$1" --color "$2" --description "$3" --force
}

create prd 5319E7 "Issue padre con la especificación de una feature"
create afk 0E8A16 "La puede implementar un agente sin humano"
create hitl D93F0B "Requiere decisión o revisión humana"
create ready-for-agent 1D76DB "Lista para que un agente la tome"
create qa-finding FBCA04 "Hallazgo de QA o revisión convertido en trabajo"
