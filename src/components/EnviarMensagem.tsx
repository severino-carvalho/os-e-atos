import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/ReuniButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { enviarMensagem } from "@/services/mensagens";

interface Props {
  instituicaoId: number;
  instituicaoNome: string;
  postagemId?: number | null;
}

/**
 * Botão + diálogo para um colaborador enviar uma mensagem avulsa a uma
 * instituição (opcionalmente referenciando uma postagem).
 */
export function EnviarMensagem({ instituicaoId, instituicaoNome, postagemId }: Props) {
  const [aberto, setAberto] = useState(false);
  const [conteudo, setConteudo] = useState("");

  const enviar = useMutation({
    mutationFn: () =>
      enviarMensagem({
        instituicaoId,
        postagemId: postagemId ?? undefined,
        conteudo: conteudo.trim(),
      }),
    onSuccess: () => {
      setConteudo("");
      setAberto(false);
    },
  });

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquare size={16} aria-hidden /> Enviar mensagem
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mensagem para {instituicaoNome}</DialogTitle>
          <DialogDescription>
            Sua mensagem será enviada diretamente para a instituição.
          </DialogDescription>
        </DialogHeader>

        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value.slice(0, 1000))}
          rows={5}
          placeholder="Escreva sua mensagem..."
          className="w-full resize-none rounded-xl border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        {enviar.isError && (
          <p className="text-sm text-destructive">
            {enviar.error instanceof Error ? enviar.error.message : "Não foi possível enviar."}
          </p>
        )}

        <DialogFooter>
          <Button
            disabled={conteudo.trim() === "" || enviar.isPending}
            onClick={() => enviar.mutate()}
          >
            {enviar.isPending ? "Enviando..." : "Enviar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
