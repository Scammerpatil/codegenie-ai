public class LanguageServerProtocol {
    public static void main(String[] args) throws Exception {
        Launcher<LanguageClient> launcher = LSPLauncher.createServerLauncher(new MyLanguageServerImpl(), System.in,
                System.out);
        launcher.startListening();
    }
}
